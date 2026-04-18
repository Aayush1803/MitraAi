from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini_engine import fact_check

app = Flask(__name__)

# ─── CORS ──────────────────────────────────────────────────────────────────────
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",         # Next.js dev
    "https://your-app.vercel.app",   # Replace with production URL
]}})


# ─── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return jsonify({
        "service": "Mitra AI Backend",
        "version": "1.0.0",
        "status":  "running",
        "model":   "gemini-1.5-flash",
    })


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/analyze")
def analyze():
    data = request.get_json(silent=True)

    if not data or not data.get("input"):
        return jsonify({"error": "Missing 'input' field"}), 400

    user_input = str(data["input"]).strip()

    if len(user_input) < 3:
        return jsonify({"error": "Input too short (minimum 3 characters)"}), 400

    if len(user_input) > 10000:
        return jsonify({"error": "Input too long (maximum 10,000 characters)"}), 400

    result = fact_check(user_input)

    if "error" in result:
        return jsonify(result), 500

    return jsonify(result)


# ─── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
