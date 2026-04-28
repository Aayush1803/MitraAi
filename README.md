# Mitra AI 🛡️

**Truth has a new guardian.**  
Mitra AI is India's most advanced, fully multimodal fact-checking platform. Engineered to counter regional misinformation across digital platforms like WhatsApp, X (formerly Twitter), Facebook, and YouTube, Mitra is the ultimate defense against fake news, deepfakes, and synthetic media. Built to handle complex code-mixed languages and deeply entrenched India-specific cultural contexts, Mitra detects, analyzes, cross-references, and debunks false claims in seconds using cutting-edge Generative AI.

---

## ⚡ Comprehensive Feature Suite

- **Omni-Channel Multimodal Inputs:** 
  - **Text:** Paste raw text, WhatsApp forwards, or social media excerpts.
  - **URLs:** Submit any public URL (News articles, Blogs, Reddit, Quora). Our intelligent scraping pipeline utilizes advanced semantic HTML extraction and YouTube Transcript TimedText API integration to extract pure context.
  - **Media Uploads:** Directly upload images, audio clips, video files, and PDF documents. The native multimodal pipeline handles Base64 extraction to seamlessly process media without relying on third-party OCR or disjointed transcribers.

- **Unmatched Multilingual Intelligence (23 Official Languages):** 
  - Mitra automatically detects and analyzes content across all 23 official Indian languages as mandated by the 8th Schedule of the Indian Constitution.
  - *Supported Languages:* Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Maithili, Sanskrit, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, and Santali.
  - Effectively parses complex Indian code-mixed formats such as Hinglish and Tanglish, interpreting regional slang and localized idioms.

- **The Deep-Dive 9-Step Pipeline:** 
  1. Input Collection
  2. Language & Modality Detection
  3. Factual Claim Extraction (Separating opinion from verifiable assertion)
  4. Advanced Logic & Knowledge Graph Cross-Referencing (Alt News, BOOM Live, Reuters, WHO)
  5. Manipulation Detection (Audio splicing, visual deepfakes)
  6. Virality Risk Scoring & Spread Prediction
  7. Regional & Cultural Contextualization
  8. Trust Score Generation (0-100 Confidence Index)
  9. ELI10 Explanation & Reporting

- **Frictionless Counter-Message Generation:** 
  - Instantly outputs a polite, highly localized, and factual counter-message explicitly formatted to be copied and forwarded directly into WhatsApp family groups or social media threads to fight fake news at its origin.

- **Premium 'Luxury-Technical' UI/UX:** 
  - A breathtaking, dark-themed user interface utilizing glassmorphism, Aurora Halo gradients, dynamic Framer Motion micro-animations, real-time pulse effects, and the ultra-modern Syne typography.

---

## 🛠️ The Architecture & Technology Stack

Mitra AI operates on a highly resilient, globally distributed serverless full-stack architecture designed for instantaneous latency and massive concurrent scaling.

- **Frontend & Core Framework:** 
  - **Next.js 14 (App Router):** Leveraging React Server Components (RSC) and Server Actions for highly optimized, SSR/SSG workflows.
  - **Styling & UI:** Tailwind CSS v4 paired with Framer Motion and Lucide React icons for fluid, GPU-accelerated interface rendering.

- **Authentication & Security:** 
  - **NextAuth.js (Auth.js):** Managing secure session states with deep Google OAuth2 SSO integration.
  - **Credentials Provider:** Custom email/password login fortified with `bcryptjs` (Cost Factor 12) for industry-standard cryptographic hashing.

- **Database & State Management:** 
  - **Neon Serverless Postgres:** Replacing legacy monolithic databases, Neon provides infinitely scalable PostgreSQL with true serverless auto-scaling and zero cold-boot latency.
  - **Prisma ORM:** Enforcing strict end-to-end type safety, automated schema migrations, and optimized connection pooling bridging the edge network and the Neon database.

- **Artificial Intelligence Engine:** 
  - **Google Gemini 2.5 Flash:** The core brain of Mitra. We bypass older fragmented NLP pipelines in favor of Gemini's native multimodal API (`GenerativeLanguage`). This allows Mitra to natively "see" videos and "hear" audio directly via inline Base64 streaming, ensuring maximum contextual awareness without hallucinations.

- **Advanced Web Scraping Engine:** 
  - **Cheerio & Fetch API:** A custom-built, highly intelligent pipeline that strips away web noise (ads, modals, trackers) to extract pristine article bodies using 15+ semantic HTML fallback selectors.
  - **YouTube API Hook:** Gracefully intercepts YouTube URLs to extract video titles, descriptions, and full TimedText XML captions natively.

- **Deployment & Hosting:** 
  - **Netlify Edge & Serverless Functions:** The entire application is deployed globally on Netlify. We utilize specialized `maxDuration` configurations (up to 60 seconds) to guarantee stability during heavy video and media processing. *(Note: Initially prototyped on Railway, the final architecture relies heavily on Netlify for seamless Next.js App Router API edge execution and Neon for distributed data).*

---

## 👨‍💻 Meet the Visionaries

- **Aayush Joshi** — Founder & Lead Architect
  *(System Design, Full-Stack Engineering, AI Integration, UI/UX Design, DevOps & Deployment)*
- **Ayushmaan Srivastava** — Co-founder & Chief Motivator
  *(Moral Support, Ideation, Strategy)*
- **Aditya Rauniyar** — Co-founder & Lead Presenter
  *(Pitch Deck Creation, Presentation Design, Storytelling)*

---

## 🚀 Getting Started Locally

### Prerequisites
To run Mitra AI locally, you must have the following installed and configured:
- **Node.js** (v18.17.0 or higher)
- **Google Gemini API Key** (Accessible via Google AI Studio)
- **Neon Postgres URL** (Or any valid PostgreSQL connection string)
- **Google Cloud Console Credentials** (For OAuth2 Client ID & Secret)

### Setup Instructions

1. **Clone & Install Dependencies:**
   ```bash
   git clone https://github.com/Aayush1803/MitraAi.git
   cd MitraAi
   npm install
   ```

2. **Environment Variable Configuration:**
   Create a `.env` file in the root directory. This is critical for the application to function.
   ```env
   # Database (Neon Serverless Postgres)
   DATABASE_URL="postgresql://user:password@ep-cool-snowflake-123456.us-east-1.aws.neon.tech/dbname?sslmode=require"

   # NextAuth Security
   NEXTAUTH_SECRET="generate_a_secure_random_base64_string_here"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth SSO
   GOOGLE_ID="your_google_cloud_client_id.apps.googleusercontent.com"
   GOOGLE_SECRET="your_google_cloud_client_secret"

   # Artificial Intelligence
   GEMINI_API_KEY="your_gemini_2_5_flash_api_key"
   ```

3. **Database Synchronization (Prisma):**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Initialize Development Server:**
   ```bash
   npm run dev
   ```
   *Navigate to `http://localhost:3000` to interact with the Mitra AI platform.*

---

## 📜 Ethical Considerations & License
Mitra AI is an advanced demonstration-grade tool built to showcase the power of modern AI in the fight against misinformation. While heavily optimized and strictly prompted for factual accuracy, Generative AI models can occasionally hallucinate. Users must always cross-reference critical, life-altering claims with professional, credentialed fact-checking organizations.

*Engineered with precision to bring truth back to India's information reality.*
