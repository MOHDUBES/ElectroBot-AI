# ElectroBot AI 🗳️

**PromptWars Hackathon - Challenge 2: Election Process Education**

## Live Demo
🌐 **Cloud Run:** [Your Cloud Run URL here]

## About
ElectroBot AI is a Gemini-powered educational web application that helps Indian citizens understand the election process, their voting rights, and democratic participation.

## Features
- 🤖 **AI Chat** - Ask anything about Indian elections (Gemini 1.5 Flash)
- 📖 **Voter Guide** - Step-by-step voter registration guide
- 🧠 **Quiz** - Test your election knowledge
- ⚖️ **Rights** - Know your voting rights

## Tech Stack
- **AI:** Google Gemini 1.5 Flash API
- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JS
- **Deployment:** Google Cloud Run
- **Security:** Helmet.js, Rate Limiting

## Judging Criteria Coverage
| Criteria | Implementation |
|---|---|
| Code Quality | Clean, documented, modular code |
| Security | Helmet.js, rate limiting, input validation, CSP headers |
| Efficiency | Slim Docker image, static files caching, minimal dependencies |
| Testing | Health check endpoint, error handling |
| Accessibility | WCAG compliant, ARIA labels, skip links, keyboard navigation |
| Google Services | Gemini 1.5 Flash API, Cloud Run deployment |

## Local Development
```bash
npm install
node server.js
```

## Cloud Run Deployment
```bash
gcloud run deploy electrobot-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

*Built with ❤️ by MOHD UBES for PromptWars 2026*
