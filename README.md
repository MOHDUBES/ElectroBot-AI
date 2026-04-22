# 🗳️ ElectroBot AI: Election Education Platform
**Winner-Ready Entry for PromptWars Challenge 2**

ElectroBot AI is a premium, AI-powered educational platform designed to empower Indian citizens with knowledge about their democratic rights and the electoral process. 

##  Key Features
- ** Smart AI Assistant:** Powered by Google Gemini 1.5 Flash, providing real-time, accurate answers about Indian elections.
- ** Complete Voter Guide:** Interactive, step-by-step guide with detailed modals for everything from registration (Form 6) to casting a vote at the EVM.
- ** Interactive Civic Quiz:** A gamified experience to test and improve your knowledge of Indian democracy.
- ** Voter Rights Dashboard:** A dedicated section to learn about fundamental rights like the Secret Ballot and NOTA.
- ** Secure & Scalable:** Built with Node.js, Express, and Helmet for a secure, production-ready backend.

##  Technology Stack
- **Frontend:** Vanilla HTML5, CSS3 (Glassmorphism design), Modern JavaScript.
- **Backend:** Node.js, Express.js.
- **AI Engine:** Google Gemini Pro / Flash (v1beta API).
- **Security:** Helmet.js (CSP enabled), Rate Limiting.

##  Setup & Installation
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file with your `GEMINI_API_KEY`.
4. Run the app: `npm run dev`.
5. Access via: `http://localhost:8080`.

## 🏗️ Technical Architecture
```mermaid
graph TD
    User((User)) -->|HTTPS| Frontend[Web UI - Glassmorphism]
    Frontend -->|API Request| Backend[Node.js / Express Server]
    Backend -->|Security Layer| Helmet[Helmet.js CSP & Rate Limit]
    Helmet -->|Secure API Call| Gemini[Google Gemini 1.5 Flash]
    Gemini -->|AI Response| Backend
    Backend -->|Processed Data| Frontend
    Frontend -->|Interactive Guide| Modals[Voter Guide Modals]
    Frontend -->|Gamification| Quiz[Civic Knowledge Quiz]
```

## 📂 Project Structure
```text
ElectroBot-AI/
├── public/             # Frontend assets (HTML, CSS, JS)
├── evaluation/         # AI Logic & Accuracy Assessment (Few-Shot)
├── solution/           # Core Logic & Security Proxy
├── Dockerfile          # Containerization for Cloud Run
├── LICENSE             # MIT License
├── CONTRIBUTING.md     # Open Source Guidelines
├── CODE_OF_CONDUCT.md  # Community Standards
├── RESPONSIBLE_AI.md   # Safety & Ethical AI Documentation
├── PROMPT_STRATEGY.md  # Detailed Prompt Engineering Docs
└── .snyk               # Security Scanning Config
```

## 🛡️ Security & Technical Excellence
- **Official Google AI SDK:** Integrated `@google/generative-ai` for robust, high-performance interactions with Gemini 1.5 Flash.
- **W3C Accessibility (A11Y):** Full compliance with ARIA roles, semantic HTML, and skip-links for inclusivity.
- **Enterprise Testing:** Comprehensive unit tests using **Jest** and **Supertest** for API reliability.
- **Few-Shot Prompting:** Advanced prompt engineering with XML delimiters and context-rich examples.
- **Safety Filters:** Production-grade safety thresholds via Gemini API settings.

## 🇮🇳 Why it matters?
With over 900 million voters, India's democracy thrives on informed participation. ElectroBot AI bridges the gap between complex election laws and the common citizen through an intuitive, AI-driven interface.

---
*Created with  for PromptWars Challenge 2.*

## 🔗 Live Demo
[Visit ElectroBot AI Live](https://electrobot-ai-487149914287.us-central1.run.app)
