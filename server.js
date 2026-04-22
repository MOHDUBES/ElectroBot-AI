/**
 * ElectroBot AI Server
 * Purpose: Secure backend proxy for Gemini AI and static file hosting.
 * Author: MOHD UBES
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "https://*.googleusercontent.com"],
      frameSrc: ["'self'", "https://voters.eci.gov.in", "https://*.eci.gov.in"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ============================================
// RATE LIMITING
// ============================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// ============================================
// BODY PARSER
// ============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// SERVE STATIC FILES
// ============================================
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

/**
 * @route POST /api/chat
 * @description Secure proxy endpoint for Google Gemini AI.
 * @param {string} message - The user's query about elections.
 * @returns {JSON} AI response or error message.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 chars)' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured', fallback: true });
    }

    const SYSTEM_PROMPT = `You are ElectroBot AI, an expert educational assistant specializing in Indian Election Process and Democracy.
Your role is to educate citizens about:
- Indian Election Commission (ECI) and its functions
- Voter registration process and EPIC (Voter ID)
- Types of elections in India (Lok Sabha, Rajya Sabha, State Assembly, Panchayat)
- Electronic Voting Machines (EVM) and VVPAT
- Model Code of Conduct
- Voting rights and responsibilities
- NOTA (None of the Above)
- Election schedule and phases
- How to report election violations

Always respond in a friendly, educational tone. Keep answers concise (2-3 paragraphs max).
Use bullet points when listing steps or items. Always encourage civic participation.
If asked about something unrelated to elections/democracy, politely redirect to election topics.
Respond in the same language as the user's question (Hindi or English).`;

    let geminiResponse;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // Increased to 15s

      try {
        console.log(`--- Chat Request (Attempt ${attempts + 1}) ---`);
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\nQuestion: " + message }] }
              ],
              generationConfig: { temperature: 0.7, maxOutputTokens: 512, topP: 0.9 },
              safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
              ]
            })
          }
        );
        clearTimeout(timeout);
        if (geminiResponse.ok) break;
        if (geminiResponse.status === 503 || geminiResponse.status === 429) {
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
        }
        break;
      } catch (err) {
        clearTimeout(timeout);
        attempts++;
        if (attempts >= maxAttempts) throw err;
      }
    }

    const data = await geminiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.log('No text in response. Finish Reason:', data.candidates?.[0]?.finishReason);
      throw new Error('Empty response from AI (likely safety block)');
    }
    console.log('Gemini Text:', text ? 'Received' : 'Empty');

    if (!text) throw new Error('Empty response from Gemini');

    res.json({ response: text });

  } catch (error) {
    console.error('Chat API error:', error.message);
    res.status(500).json({ error: 'AI service error', fallback: true });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ElectroBot AI',
    hasApiKey: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// MAIN ROUTE
// ============================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n');
  console.log('  🗳️  ElectroBot AI - Election Education App');
  console.log('  ─────────────────────────────────────────');
  console.log(`  ✅  Server running!`);
  console.log(`  🌐  Local:   http://localhost:${PORT}`);
  console.log(`  🔑  API Key: ${GEMINI_API_KEY ? '✅ Configured' : '❌ Missing - add to .env'}`);
  console.log('  ─────────────────────────────────────────');
  console.log('  💡  Ctrl+Click the link to open in browser');
  console.log('  🛑  Press Ctrl+C to stop\n');
});

module.exports = app;
