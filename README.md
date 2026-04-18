# Mitra AI 🛡️

**Truth has a new guardian.**  
Mitra AI is India's most advanced multimodal fact-checking platform designed to counter regional misinformation, particularly on platforms like WhatsApp. Built to handle complex code-mixed languages and India-specific cultural contexts, Mitra detects, analyzes, and debunks false claims in seconds.

---

## ⚡ Features

- **Multimodal Inputs:** Analyze raw text (WhatsApp forwards), article URLs, and uploaded media files.
- **Multilingual Support:** Auto-detects and analyzes content across English, Hindi, and Tamil (including Hinglish/Tanglish).
- **The 9-Step Pipeline:** Claims extraction, factual verification, cross-referencing with trusted databases (Reuters, WHO, Alt News, BOOM Live), and virality risk assessment.
- **Trust Scoring:** Generates a 0-100 confidence index based on veracity, language cues, and source credibility.
- **Counter-Message Generation:** Instantly outputs a polite, localized counter-message ready to be copied and pasted directly into WhatsApp threads to fight fake news at its source.

## 🛠️ Technology Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Framer Motion for advanced UI animations.
- **Backend:** Python, Flask, `python-dotenv`.
- **AI Engine:** Google Gemini (GenerativeLanguage API) running the latest `gemini-2.5-flash` endpoint.
- **Design System:** "Luxury-Technical" theme using the Syne display font, glassmorphism, and dynamic GPU-accelerated micro-animations.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- A Google Gemini API Key

### Backend Setup (API & AI Engine)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up your virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
4. Run the Flask server:
   ```bash
   python main.py
   ```
   *The backend will run on `http://localhost:8000`.*

### Frontend Setup (Next.js Application)
1. Navigate back to the root directory and install dependencies:
   ```bash
   npm install
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.

## 📜 License & Usage
This is a demonstration-grade tool. While heavily optimized, always verify critical claims with professional fact-checking organizations.

---
*Built to bring truth back to India's information reality.*
