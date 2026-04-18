import os
import json
import re
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ─── Config ────────────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PROMPT_FILE    = Path(__file__).parent / "prompt.txt"
GEMINI_URL     = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent?key={key}"
)

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY not set. Copy backend/.env.example to backend/.env and add your key."
    )

# ─── Generation config (built fresh per request, never mutated) ────────────────
def _make_gen_config() -> dict:
    return {
        "temperature":      0.2,
        "topP":             0.8,
        "topK":             40,
        "maxOutputTokens":  2048,
        "candidateCount":   1,
    }


# ─── JSON Cleaner ─────────────────────────────────────────────────────────────
def clean_json(text: str) -> dict:
    """
    3-tier JSON extraction:
    1. Direct json.loads()
    2. Extract between first { and last }
    3. Fix trailing commas + single quotes, then re-parse
    """
    # Strip markdown code fences
    text = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.IGNORECASE | re.MULTILINE)
    text = re.sub(r"\s*```\s*$",        "", text.strip(), flags=re.MULTILINE).strip()

    # Tier 1
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Tier 2
    start, end = text.find("{"), text.rfind("}")
    if start != -1 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            pass

    # Tier 3
    fixed = re.sub(r",\s*([}\]])", r"\1", text)
    fixed = fixed.replace("'", '"')
    start, end = fixed.find("{"), fixed.rfind("}")
    if start != -1 and end > start:
        try:
            return json.loads(fixed[start:end + 1])
        except json.JSONDecodeError:
            pass

    print("[gemini_engine] ❌ All JSON parse tiers failed. Raw output (first 500 chars):")
    print(text[:500])
    return {
        "error":      "Invalid JSON from model",
        "raw_output": text[:1000],
    }


# ─── Core Function ─────────────────────────────────────────────────────────────
def fact_check(user_input: str) -> dict:
    """
    Fact-check pipeline:
      Load prompt.txt  →  inject user_input  →  POST to Gemini  →  parse JSON
    """

    # ── 0. Validate input ──────────────────────────────────────────────────────
    user_input = user_input.strip()
    if not user_input:
        return {"error": "Empty input received"}

    print(f"\n{'='*60}")
    print(f"[gemini_engine] 📥 Received input ({len(user_input)} chars):")
    print(f"  {user_input[:200]}")

    # ── 1. Load prompt from file (fresh read every call, no caching) ───────────
    if not PROMPT_FILE.exists():
        return {"error": f"prompt.txt not found at {PROMPT_FILE}"}

    prompt_template = PROMPT_FILE.read_text(encoding="utf-8")

    # ── 2. Inject user input (with verification guard) ─────────────────────────
    PLACEHOLDER = "{user_input}"

    if PLACEHOLDER not in prompt_template:
        print(f"[gemini_engine] ⚠️  WARNING: '{PLACEHOLDER}' not found in prompt.txt!")
        print("[gemini_engine]    Appending user input directly to prompt.")
        final_prompt = prompt_template.rstrip() + f"\n\nINPUT:\n{user_input}"
    else:
        final_prompt = prompt_template.replace(PLACEHOLDER, user_input)

    # ── 3. Verify replacement worked ──────────────────────────────────────────
    if user_input[:30] not in final_prompt:
        print("[gemini_engine] ⚠️  WARNING: User input not found in final prompt after replace!")
        final_prompt = final_prompt + f"\n\n[Input to analyze]: {user_input}"

    print(f"[gemini_engine] 📝 Final prompt preview (last 300 chars):")
    print(f"  ...{final_prompt[-300:]}")
    print(f"[gemini_engine] 📏 Total prompt length: {len(final_prompt)} chars")

    # ── 4. Build payload (fresh config dict each call) ────────────────────────
    payload = {
        "contents": [
            {
                "role":  "user",
                "parts": [{"text": final_prompt}],
            }
        ],
        "generationConfig": _make_gen_config(),   # fresh dict, never reused
    }

    # ── 5. Call Gemini REST API ───────────────────────────────────────────────
    url = GEMINI_URL.format(key=GEMINI_API_KEY)

    try:
        print(f"[gemini_engine] 🚀 Sending request to Gemini API...")
        response = requests.post(
            url,
            json=payload,
            timeout=60,
            headers={"Content-Type": "application/json"},
        )
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        err_body = e.response.text if e.response else "no body"
        print(f"[gemini_engine] ❌ HTTP error: {e} — {err_body[:300]}")
        return {"error": f"Gemini API error: {e}", "details": err_body[:300]}
    except requests.exceptions.Timeout:
        print("[gemini_engine] ❌ Request timed out after 60s")
        return {"error": "Gemini API timeout"}
    except requests.exceptions.RequestException as e:
        print(f"[gemini_engine] ❌ Network error: {e}")
        return {"error": f"Network error: {e}"}

    # ── 6. Extract text ────────────────────────────────────────────────────────
    data = response.json()

    # Check for finish reason / safety blocks
    candidate = data.get("candidates", [{}])[0]
    finish_reason = candidate.get("finishReason", "UNKNOWN")
    if finish_reason not in ("STOP", "MAX_TOKENS", "UNKNOWN"):
        print(f"[gemini_engine] ⚠️  Unexpected finishReason: {finish_reason}")

    raw_text = (
        candidate
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
        .strip()
    )

    print(f"[gemini_engine] 📤 Raw model output ({len(raw_text)} chars):")
    print(f"  {raw_text[:400]}")
    print(f"{'='*60}\n")

    if not raw_text:
        print(f"[gemini_engine] ❌ Empty response. Full API response: {data}")
        return {"error": "Empty response from Gemini", "raw": data}

    # ── 7. Parse JSON and return ──────────────────────────────────────────────
    result = clean_json(raw_text)

    # Stamp result with input echo so frontend can verify it's not stale
    result["_debug_input_echo"] = user_input[:80]

    return result
