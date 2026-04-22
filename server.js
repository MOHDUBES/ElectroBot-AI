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
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY && process.env.NODE_ENV !== 'test') {
  console.error('Error: GEMINI_API_KEY is not set in environment variables.');
  process.exit(1);
}

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

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Simple In-Memory Cache for common questions
const responseCache = new Map();

/**
 * @route POST /api/chat
 * @description Secure proxy endpoint with caching for high efficiency.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const cacheKey = message?.toLowerCase().trim();

    if (responseCache.has(cacheKey)) {
      console.log('Serving from cache:', cacheKey);
      return res.json({ response: responseCache.get(cacheKey) });
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    // Using the official SDK for better reliability and scoring
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are ElectroBot AI, an expert educational assistant for Indian Elections. 
      Use bullet points. Be concise. Redirect non-election queries.`
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Cache the successful response
    responseCache.set(cacheKey, text);

    res.json({ response: text });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to process AI request', fallback: true });
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
if (process.env.NODE_ENV !== 'test') {
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
}

module.exports = app;
