/**
 * ElectroBot AI - Election Education App
 * Powered by Google Gemini AI
 * PromptWars Hackathon Challenge 2
 */

// ============================================
// CONFIGURATION
// ============================================
const API_KEY = window.GEMINI_API_KEY || 'AIzaSyDummyKeyForDevelopment';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

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
- Candidates' eligibility criteria
- Electoral rolls and how to check voter registration
- How to report election violations

Always respond in a friendly, educational tone. Keep answers concise (2-3 paragraphs max). 
Use bullet points when listing steps or items.
Always encourage civic participation.
If asked about something unrelated to elections/democracy, politely redirect to election topics.
Respond in the same language as the user's question (Hindi or English).`;

// ============================================
// NAVIGATION
// ============================================
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });
  
  const section = document.getElementById(`section-${name}`);
  const btn = document.getElementById(`nav-${name}`);
  
  if (section) section.classList.add('active');
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-current', 'page');
  }

  if (name === 'quiz') initQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================
let isProcessing = false;

async function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text || isProcessing) return;

  isProcessing = true;
  input.value = '';
  document.getElementById('send-btn').disabled = true;

  appendMessage('user', text);
  showTyping(true);

  try {
    const response = await callGeminiAPI(text);
    showTyping(false);
    appendMessage('bot', response);
  } catch (error) {
    showTyping(false);
    appendMessage('bot', getFallbackResponse(text));
  }

  isProcessing = false;
  document.getElementById('send-btn').disabled = false;
  input.focus();
}

async function callGeminiAPI(userMessage) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    })
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(userMessage);
}

function getFallbackResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('register') || q.includes('registration') || q.includes('panjikaran')) {
    return `**Voter Registration Process:**\n\n1. Visit voterportal.eci.gov.in or download the Voter Helpline App\n2. Fill Form 6 with your details\n3. Upload required documents (Aadhaar, photo, address proof)\n4. Submit and wait for verification\n\nYou can also visit your nearest Electoral Registration Officer (ERO) office for offline registration. Call 1950 for assistance! 🗳️`;
  }
  if (q.includes('evm') || q.includes('voting machine')) {
    return `**Electronic Voting Machine (EVM):**\n\nEVMs are standalone electronic devices used in Indian elections since 1998. They consist of:\n- **Ballot Unit**: Has buttons for each candidate with their symbol\n- **Control Unit**: Used by polling officials to enable voting\n- **VVPAT**: Prints a paper slip showing your vote for verification\n\nEVMs are tamper-proof and not connected to internet, making them secure! ✅`;
  }
  if (q.includes('nota') || q.includes('none of the above')) {
    return `**NOTA (None of the Above):**\n\nNOTA was introduced by the Supreme Court in 2013. It allows voters to reject all candidates if they find none worthy. The NOTA symbol (crossed ballot) appears as the last option on EVMs.\n\nImportant: Even if NOTA gets the most votes, the candidate with the highest votes still wins. NOTA is a way to express democratic dissent! 🚫`;
  }
  if (q.includes('eci') || q.includes('election commission')) {
    return `**Election Commission of India (ECI):**\n\nECI is an autonomous constitutional authority established in 1950. Key functions:\n- Conduct free and fair elections\n- Manage Electoral Rolls\n- Enforce Model Code of Conduct\n- Register political parties\n- Monitor election expenses\n\nIt is headed by the Chief Election Commissioner and operates independently of the government. 🏛️`;
  }
  return `Thank you for your question! I'm ElectroBot AI, here to educate you about Indian elections. 🗳️\n\nYou can ask me about:\n- Voter registration process\n- How EVMs work\n- ECI's role and functions\n- Your voting rights\n- Model Code of Conduct\n- NOTA option\n\nFor official information, visit **voterportal.eci.gov.in** or call the Voter Helpline: **1950** 📞`;
}

function appendMessage(sender, text) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `message ${sender === 'bot' ? 'bot-message' : 'user-message'}`;
  div.setAttribute('role', 'article');

  const formattedText = formatText(text);
  div.innerHTML = `
    <div class="message-avatar" aria-hidden="true">${sender === 'bot' ? '🤖' : '👤'}</div>
    <div class="message-content">
      <p class="message-sender">${sender === 'bot' ? 'ElectroBot AI' : 'You'}</p>
      <div class="message-text">${formattedText}</div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

function showTyping(visible) {
  const indicator = document.getElementById('typing-indicator');
  indicator.classList.toggle('hidden', !visible);
  const container = document.getElementById('chat-messages');
  container.scrollTop = container.scrollHeight;
}

function askQuick(question) {
  document.getElementById('user-input').value = question;
  sendMessage({ preventDefault: () => {} });
}

// ============================================
// QUIZ
// ============================================
const quizQuestions = [
  {
    q: "What is the minimum age to vote in Indian elections?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    icon: "🗓️"
  },
  {
    q: "What does NOTA stand for in Indian elections?",
    options: ["No Official Tallied Answer", "None of the Above", "National Option Tally Act", "Not on the Application"],
    correct: 1,
    icon: "❌"
  },
  {
    q: "Which body conducts elections in India?",
    options: ["Supreme Court", "Parliament", "Election Commission of India", "President's Office"],
    correct: 2,
    icon: "🏛️"
  },
  {
    q: "What is EPIC in Indian elections?",
    options: ["Electronic Party Identification Card", "Electors Photo Identity Card", "Election Process Identity Certificate", "Electoral Poll Identification Code"],
    correct: 1,
    icon: "🆔"
  },
  {
    q: "What is the Voter Helpline number in India?",
    options: ["100", "112", "1950", "1800"],
    correct: 2,
    icon: "📞"
  },
  {
    q: "VVPAT stands for what?",
    options: ["Voter Verified Paper Audit Trail", "Verified Voting Paper Authority Trail", "Vote Verification Paper And Tally", "Voter Validated Polling Audit Track"],
    correct: 0,
    icon: "📄"
  },
  {
    q: "Which Form is used for new voter registration in India?",
    options: ["Form 3", "Form 6", "Form 9", "Form 12"],
    correct: 1,
    icon: "📝"
  },
  {
    q: "When was the Election Commission of India established?",
    options: ["1947", "1948", "1950", "1952"],
    correct: 2,
    icon: "📅"
  }
];

let currentQuestion = 0;
let score = 0;
let quizInitialized = false;

function initQuiz() {
  if (quizInitialized) return;
  quizInitialized = true;
  currentQuestion = 0;
  score = 0;
  updateScoreDisplay();
  showQuestion();
}

function showQuestion() {
  const q = quizQuestions[currentQuestion];
  document.getElementById('q-num').textContent = currentQuestion + 1;
  document.getElementById('progress-fill').style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
  document.querySelector('.quiz-icon').textContent = q.icon;
  document.getElementById('question-text').textContent = q.q;

  const container = document.getElementById('options-container');
  container.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.onclick = () => selectAnswer(i);
    container.appendChild(btn);
  });

  document.getElementById('quiz-card').classList.remove('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
}

function selectAnswer(selectedIndex) {
  const q = quizQuestions[currentQuestion];
  const btns = document.querySelectorAll('.option-btn');
  
  btns.forEach((btn, i) => {
    btn.disabled = true;
    btn.setAttribute('aria-checked', 'false');
    if (i === q.correct) btn.classList.add('correct');
    else if (i === selectedIndex && i !== q.correct) btn.classList.add('wrong');
  });

  if (selectedIndex === q.correct) {
    score++;
    updateScoreDisplay();
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function showResult() {
  document.getElementById('quiz-card').classList.add('hidden');
  const result = document.getElementById('quiz-result');
  result.classList.remove('hidden');

  const pct = Math.round((score / quizQuestions.length) * 100);
  let icon, title, desc;

  if (pct >= 80) {
    icon = '🏆'; title = `Excellent! ${pct}% Score`;
    desc = `Outstanding! You scored ${score}/${quizQuestions.length}. You are well-informed about Indian elections. Share this quiz with friends to promote civic awareness! 🇮🇳`;
  } else if (pct >= 60) {
    icon = '👍'; title = `Good Job! ${pct}% Score`;
    desc = `You scored ${score}/${quizQuestions.length}. You have a decent understanding of Indian elections. Keep learning with ElectroBot AI!`;
  } else {
    icon = '📚'; title = `Keep Learning! ${pct}% Score`;
    desc = `You scored ${score}/${quizQuestions.length}. Don't worry! Check the Voter Guide section and try again. Every informed citizen makes India stronger! 💪`;
  }

  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-desc').textContent = desc;
  document.getElementById('quiz-progress').setAttribute('aria-valuenow', score);
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  quizInitialized = false;
  updateScoreDisplay();
  initQuiz();
}

function updateScoreDisplay() {
  document.getElementById('score-display').textContent = score;
  document.getElementById('total-display').textContent = quizQuestions.length;
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement === document.getElementById('user-input')) {
    sendMessage(e);
  }
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  showSection('chat');
  console.log('🗳️ ElectroBot AI initialized - Powered by Google Gemini AI');
});
