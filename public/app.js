/**
 * ElectroBot AI - Election Education App
 * Powered by Google Gemini AI
 * PromptWars Hackathon - Challenge 2
 */

'use strict';

let currentLang = localStorage.getItem('lang') || 'en';

const translations = {
  en: {
    title: "ElectroBot AI",
    heroTitle: "Understand India's<br/><span class='gradient-text'>Election Process</span>",
    heroDesc: "Ask anything about voting, ECI, ballot process, voter registration, and your democratic rights. ElectroBot AI is here to educate and empower every Indian citizen.",
    askAI: "💬 Ask AI",
    voterGuide: "📖 Voter Guide",
    quiz: "🧠 Quiz",
    rights: "⚖️ Your Rights",
    registeredVoters: "Registered Voters",
    lokSabhaSeats: "Lok Sabha Seats",
    poweredAnswers: "Powered Answers",
    appearance: "Appearance",
    language: "Language / भाषा",
    footerNote: "🇮🇳 Promoting Civic Awareness",
    chatPlaceholder: "Ask about elections...",
    send: "Send",
    quickQuestions: "Quick Questions:",
    typing: "ElectroBot is thinking...",
    // Section Headers
    headerChat: "Ask ElectroBot AI",
    headerGuide: "Comprehensive Voter Guide",
    headerQuiz: "Election Knowledge Quiz",
    headerRights: "Know Your Democratic Rights",
    // Guide Steps
    guideSteps: [
      { t: "Check Eligibility", d: "Ensure you are 18+ and an Indian citizen." },
      { t: "Fill Form 6", d: "Register yourself at the Voter Portal." },
      { t: "Verify Documents", d: "Keep your Aadhaar and Address proof ready." },
      { t: "EPIC Card", d: "Download your digital Voter ID card." },
      { t: "Find Booth", d: "Locate your assigned polling station." },
      { t: "Cast Vote", d: "Go to your booth and use the EVM machine." }
    ],
    // Rights
    rightsCards: [
      { t: "Right to Vote", d: "Every citizen above 18 can vote freely." },
      { t: "Right to Information", d: "Know about candidates and their background." },
      { t: "Right to Secret Ballot", d: "Your vote is your secret; nobody can ask." },
      { t: "Right to Equality", d: "One Person, One Vote, One Value." },
      { t: "Accessible Voting", d: "All booths must be accessible for differently-abled." },
      { t: "Paid Leave to Vote", d: "Employer must give you paid leave on election day." }
    ]
  },
  hi: {
    title: "इलेक्ट्रोबॉट AI",
    heroTitle: "भारत की <br/><span class='gradient-text'>चुनाव प्रक्रिया</span> को समझें",
    heroDesc: "मतदान, चुनाव आयोग, बैलेट प्रक्रिया, मतदाता पंजीकरण और अपने लोकतांत्रिक अधिकारों के बारे में कुछ भी पूछें। इलेक्ट्रोबॉट AI यहाँ हर भारतीय नागरिक को शिक्षित और सशक्त बनाने के लिए है।",
    askAI: "💬 AI से पूछें",
    voterGuide: "📖 मतदाता गाइड",
    quiz: "🧠 क्विज़",
    rights: "⚖️ आपके अधिकार",
    registeredVoters: "पंजीकृत मतदाता",
    lokSabhaSeats: "लोकसभा सीटें",
    poweredAnswers: "AI द्वारा उत्तर",
    appearance: "दिखावट (Dark Mode)",
    language: "भाषा / Language",
    footerNote: "🇮🇳 नागरिक जागरूकता को बढ़ावा देना",
    chatPlaceholder: "चुनाव के बारे में पूछें...",
    send: "भेजें",
    quickQuestions: "त्वरित प्रश्न:",
    typing: "इलेक्ट्रोबॉट सोच रहा है...",
    // Section Headers
    headerChat: "इलेक्ट्रोबॉट AI से पूछें",
    headerGuide: "विस्तृत मतदाता मार्गदर्शिका",
    headerQuiz: "चुनाव ज्ञान क्विज़",
    headerRights: "अपने लोकतांत्रिक अधिकारों को जानें",
    // Guide Steps
    guideSteps: [
      { t: "पात्रता जाँचें", d: "सुनिश्चित करें कि आप 18+ और भारतीय नागरिक हैं।" },
      { t: "फॉर्म 6 भरें", d: "वोटर पोर्टल पर अपना पंजीकरण कराएं।" },
      { t: "दस्तावेज़ सत्यापित करें", d: "आधार और पते का प्रमाण तैयार रखें।" },
      { t: "EPIC कार्ड", d: "अपना डिजिटल मतदाता पहचान पत्र डाउनलोड करें।" },
      { t: "बूथ खोजें", d: "अपने आवंटित मतदान केंद्र का पता लगाएं।" },
      { t: "वोट डालें", d: "अपने बूथ पर जाएं और EVM मशीन का उपयोग करें।" }
    ],
    // Rights
    rightsCards: [
      { t: "वोट देने का अधिकार", d: "18 वर्ष से ऊपर का हर नागरिक स्वतंत्र रूप से वोट दे सकता है।" },
      { t: "सूचना का अधिकार", d: "उम्मीदवारों और उनकी पृष्ठभूमि के बारे में जानें।" },
      { t: "गुप्त मतदान का अधिकार", d: "आपका वोट गुप्त है; कोई पूछ नहीं सकता।" },
      { t: "समानता का अधिकार", d: "एक व्यक्ति, एक वोट, एक मूल्य।" },
      { t: "सुलभ मतदान", d: "सभी बूथ दिव्यांगों के लिए सुलभ होने चाहिए।" },
      { t: "वोट के लिए सवैतनिक अवकाश", d: "नियोक्ता को चुनाव के दिन आपको सवैतनिक छुट्टी देनी होगी।" }
    ]
  }
};

function updateUI() {
  const t = translations[currentLang];
  
  // Update Page Title
  document.title = t.title;

  // Update Navigation (Desktop & Sidebar)
  document.querySelectorAll('[data-section="chat"]').forEach(el => el.innerHTML = t.askAI);
  document.querySelectorAll('[data-section="guide"]').forEach(el => el.innerHTML = t.voterGuide);
  document.querySelectorAll('[data-section="quiz"]').forEach(el => el.innerHTML = t.quiz);
  document.querySelectorAll('[data-section="rights"]').forEach(el => el.innerHTML = t.rights);
  
  // Update Hero
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) heroBadge.textContent = currentLang === 'hi' ? '🇮🇳 जेमिनी AI द्वारा संचालित' : '🇮🇳 Powered by Gemini AI';
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.innerHTML = t.heroTitle;
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) heroDesc.textContent = t.heroDesc;
  
  // Update Stats Labels
  document.querySelectorAll('.stat-label').forEach((el, i) => {
    if (i === 0) el.textContent = t.registeredVoters;
    if (i === 1) el.textContent = t.lokSabhaSeats;
    if (i === 2) el.textContent = t.poweredAnswers;
  });
  
  // Update Section Headers
  const hChat = document.querySelector('#section-chat .section-header h2');
  const pChat = document.querySelector('#section-chat .section-header p');
  if (hChat) hChat.textContent = t.headerChat;
  if (pChat) pChat.textContent = currentLang === 'hi' ? 'भारतीय चुनाव प्रक्रिया के बारे में तुरंत AI-संचालित उत्तर प्राप्त करें' : 'Get instant AI-powered answers about the Indian election process';

  const hGuide = document.querySelector('#section-guide .section-header h2');
  const pGuide = document.querySelector('#section-guide .section-header p');
  if (hGuide) hGuide.textContent = t.headerGuide;
  if (pGuide) pGuide.textContent = currentLang === 'hi' ? 'भारतीय लोकतंत्र में भाग लेने के लिए चरण-दर-चरण मार्गदर्शिका' : 'Step-by-step guide to participate in Indian democracy';

  const hQuiz = document.querySelector('#section-quiz .section-header h2');
  if (hQuiz) hQuiz.textContent = t.headerQuiz;

  const hRights = document.querySelector('#section-rights .section-header h2');
  if (hRights) hRights.textContent = t.headerRights;

  // Update Quick Questions
  const quickLabel = document.querySelector('.quick-label');
  if (quickLabel) quickLabel.textContent = t.quickQuestions;
  
  const chipTranslations = {
    en: ["How to register as voter?", "What is NOTA?", "Role of ECI?", "Documents needed?", "How does EVM work?", "Model Code of Conduct?"],
    hi: ["वोटर पंजीकरण कैसे करें?", "नोटा (NOTA) क्या है?", "ECI की भूमिका?", "ज़रूरी दस्तावेज़?", "EVM कैसे काम करता है?", "आदर्श आचार संहिता?"]
  };
  const chipQueries = {
    en: ["How do I register as a voter in India?", "What is NOTA in Indian elections?", "What is the role of ECI in India?", "What documents are needed to vote in India?", "How does the EVM work?", "What is the Model Code of Conduct?"],
    hi: ["भारत में वोटर के रूप में पंजीकरण कैसे करें?", "भारतीय चुनावों में नोटा (NOTA) क्या है?", "भारत में चुनाव आयोग (ECI) की भूमिका क्या है?", "वोट देने के लिए किन दस्तावेज़ों की ज़रूरत होती है?", "EVM मशीन कैसे काम करती है?", "आदर्श आचार संहिता क्या है?"]
  };

  document.querySelectorAll('.chip').forEach((el, i) => {
    if (chipTranslations[currentLang][i]) {
      el.textContent = (i === 0 ? '🗳️ ' : i === 1 ? '❌ ' : i === 2 ? '🏛️ ' : i === 3 ? '📄 ' : i === 4 ? '⚡ ' : '📋 ') + chipTranslations[currentLang][i];
      el.setAttribute('data-question', chipQueries[currentLang][i]);
    }
  });

  // Update Guide Cards
  document.querySelectorAll('.guide-card').forEach((el, i) => {
    if (t.guideSteps[i]) {
      const h3 = el.querySelector('h3');
      const p = el.querySelector('p');
      if (h3) h3.textContent = t.guideSteps[i].t;
      if (p) p.textContent = t.guideSteps[i].d;
    }
  });

  // Update Rights Cards
  document.querySelectorAll('.right-card').forEach((el, i) => {
    if (t.rightsCards[i]) {
      const h3 = el.querySelector('h3');
      const p = el.querySelector('p');
      if (h3) h3.textContent = t.rightsCards[i].t;
      if (p) p.textContent = t.rightsCards[i].d;
    }
  });
  
  // Update Chat Input & Typing
  const userInput = document.getElementById('user-input');
  if (userInput) userInput.placeholder = t.chatPlaceholder;
  
  const typingText = document.querySelector('#typing-indicator span:last-child');
  if (typingText) typingText.textContent = t.typing;
  
  // Update Sidebar Labels
  document.querySelectorAll('.theme-label').forEach((el, i) => {
    if (i === 0) el.textContent = t.appearance;
    if (i === 1) el.textContent = t.language;
  });
  
  const footerNote = document.querySelector('.sidebar-footer p');
  if (footerNote) footerNote.textContent = t.footerNote;

  // Update Welcome Message (if it's the only one)
  const firstBotMsg = document.querySelector('.chat-messages .bot-message .message-text');
  if (firstBotMsg && document.querySelectorAll('.message').length === 1) {
    if (currentLang === 'hi') {
      firstBotMsg.innerHTML = `<p>नमस्ते! 🙏 मैं <strong>इलेक्ट्रोबॉट AI</strong> हूँ, भारत की लोकतांत्रिक प्रक्रिया को समझने के लिए आपका बुद्धिमान मार्गदर्शक।</p>
      <p>मैं आपकी मदद कर सकता हूँ:</p>
      <ul>
        <li>📋 मतदाता पंजीकरण प्रक्रिया</li>
        <li>🗳️ अपना वोट कैसे डालें</li>
        <li>🏛️ भारत निर्वाचन आयोग (ECI) की भूमिका</li>
        <li>⚖️ आपके मतदान अधिकार और कर्तव्य</li>
      </ul>
      <p>मुझसे भारतीय चुनावों के बारे में कुछ भी पूछें! 🇮🇳</p>`;
    } else {
      firstBotMsg.innerHTML = `<p>Namaste! 🙏 I am <strong>ElectroBot AI</strong>, your intelligent guide to understanding India's democratic process.</p>
      <p>I can help you understand:</p>
      <ul>
        <li>📋 Voter Registration Process</li>
        <li>🗳️ How to cast your vote</li>
        <li>🏛️ Role of Election Commission of India (ECI)</li>
        <li>⚖️ Your voting rights and duties</li>
      </ul>
      <p>Ask me anything about Indian elections! 🇮🇳</p>`;
    }
  }

  const langTextEl = document.querySelector('.sidebar .lang-text');
  if (langTextEl) langTextEl.textContent = currentLang === 'en' ? 'English' : 'हिंदी';
}





/**
 * Switches between different SPA sections.
 * @param {string} name - The ID suffix of the section to show.
 */
function showSection(name) {
  document.querySelectorAll('.section').forEach(function(s) {
    s.classList.remove('active');
  });
  document.querySelectorAll('.nav-btn, .side-btn').forEach(function(b) {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });

  var section = document.getElementById('section-' + name);

  if (section) section.classList.add('active');
  document.querySelectorAll('[data-section="' + name + '"]').forEach(function(b) {
    b.classList.add('active');
  });

  if (name === 'quiz') initQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getFallbackResponse(query) {
  var q = query.toLowerCase();
  const isHi = currentLang === 'hi';

  if (q.includes('register') || q.includes('पंजीकरण') || q.includes('regis')) {
    return isHi 
      ? '**मतदाता पंजीकरण प्रक्रिया:**\n\n1. voterportal.eci.gov.in पर जाएं\n2. फॉर्म 6 भरें\n3. आधार और पते का प्रमाण अपलोड करें। सहायता के लिए **1950** पर कॉल करें!' 
      : '**Voter Registration Process:**\n\n1. Visit voterportal.eci.gov.in\n2. Fill Form 6\n3. Upload Aadhaar and address proof. Call **1950** for help!';
  }
  if (q.includes('evm') || q.includes('मशीन') || q.includes('voting machine')) {
    return isHi
      ? '**ईवीएम (EVM):**\n\nEVM सुरक्षित स्टैंडअलोन डिवाइस हैं। ये इंटरनेट से नहीं जुड़े होते, जिससे इन्हें हैक करना असंभव है। ✅'
      : '**EVM (Electronic Voting Machine):**\n\nEVMs are secure standalone devices not connected to the internet, making them tamper-proof. ✅';
  }
  if (q.includes('document') || q.includes('दस्तावेज़') || q.includes('id proof')) {
    return isHi
      ? '**ज़रूरी दस्तावेज़:**\n\nमतदान के दिन आप इनमें से कोई भी आईडी ले जा सकते हैं:\n- वोटर आईडी (EPIC)\n- आधार कार्ड\n- पैन कार्ड\n- ड्राइविंग लाइसेंस 📄'
      : '**Required Documents:**\n\nYou can carry any of these IDs on voting day:\n- Voter ID (EPIC)\n- Aadhaar Card\n- PAN Card\n- Driving License 📄';
  }

  return 'DEFAULT';
}

function callGeminiAPI(userMessage) {
  let finalMessage = userMessage;
  if (currentLang === 'hi') {
    finalMessage = "IMPORTANT: Respond in HINDI. " + userMessage;
  }

  return fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: finalMessage })
  })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    if (data.error) throw new Error(data.error);
    return data.response;
  });
}

var isProcessing = false;

/**
 * Handles UI logic for sending a message and displaying responses.
 */
function sendMessage() {
  var input = document.getElementById('user-input');
  var text = input.value.trim();
  if (!text || isProcessing) return;

  isProcessing = true;
  var sendBtn = document.getElementById('send-btn');
  if (sendBtn) sendBtn.disabled = true;

  // 1. Check local fallback first for instant response
  var localResponse = getFallbackResponse(text);
  if (localResponse !== 'DEFAULT') {
    input.value = '';
    appendMessage('user', text);
    appendMessage('bot', localResponse);
    isProcessing = false;
    if (sendBtn) sendBtn.disabled = false;
    input.focus();
    return;
  }

  input.value = '';
  // 2. Otherwise call AI
  appendMessage('user', text);
  showTyping(true);

  callGeminiAPI(text)
    .then(function(response) {
      showTyping(false);
      appendMessage('bot', response);
    })
    .catch(function(err) {
      console.error("AI Error:", err);
      showTyping(false);
      const errorMsg = currentLang === 'hi' 
        ? "माफ़ करें, अभी मैं जवाब नहीं दे पा रहा हूँ। कृपया इंटरनेट चेक करें या थोड़ी देर बाद प्रयास करें।" 
        : "Sorry, I'm having trouble connecting to my brain. Please check your internet or try again in a moment.";
      appendMessage('bot', errorMsg);
    })
    .finally(function() {
      isProcessing = false;
      if (sendBtn) sendBtn.disabled = false;
      input.focus();
    });
}

function getFallbackResponse(query) {
  var q = query.toLowerCase();

  if (q.includes('register') || q.includes('registration') || q.includes('panjikaran')) {
    return '**Voter Registration Process:**\n\n1. Visit voterportal.eci.gov.in or download the Voter Helpline App\n2. Fill Form 6 with your personal details\n3. Upload Aadhaar, photo, and address proof\n4. Submit and wait for verification (7-15 days)\n\nYou can also visit your nearest Electoral Registration Officer (ERO) for offline registration. Call **1950** for help! 🗳️';
  }
  if (q.includes('evm') || q.includes('voting machine')) {
    return '**Electronic Voting Machine (EVM):**\n\nEVMs are secure standalone devices used in Indian elections since 1998:\n- **Ballot Unit:** Buttons for each candidate with their symbol\n- **Control Unit:** Used by polling officials\n- **VVPAT:** Prints a paper slip confirming your vote\n\nEVMs are not connected to internet, making them tamper-proof and secure! ✅';
  }
  if (q.includes('nota') || q.includes('none of the above')) {
    return '**NOTA (None of the Above):**\n\nNOTA was introduced by the Supreme Court in 2013. It allows you to reject all candidates. The crossed ballot symbol appears last on EVMs.\n\n**Important:** Even if NOTA wins the most votes, the candidate with highest actual votes still wins. NOTA is a way to express democratic dissent! 🚫';
  }
  if (q.includes('eci') || q.includes('election commission')) {
    return '**Election Commission of India (ECI):**\n\nEstablished in 1950, ECI is an autonomous constitutional authority. Key functions:\n- Conduct free and fair elections across India\n- Manage Electoral Rolls\n- Enforce Model Code of Conduct\n- Register political parties\n- Monitor election expenses\n\nHeaded by Chief Election Commissioner, it operates independently. 🏛️';
  }
  if (q.includes('document') || q.includes('id proof')) {
    return '**Documents Required to Vote:**\n\n**For Registration (Form 6):**\n- Aadhaar Card\n- Recent passport-size photograph\n- Proof of address (electricity bill, ration card, bank statement)\n\n**On Voting Day (any one):**\n- Voter ID (EPIC)\n- Aadhaar Card\n- Passport, Driving License, PAN Card, or any government-issued photo ID 📄';
  }
  if (q.includes('model code') || q.includes('mcc')) {
    return '**Model Code of Conduct (MCC):**\n\nMCC is a set of guidelines issued by ECI that comes into effect when elections are announced:\n- Political parties cannot make promises that influence voters unfairly\n- Government cannot announce new schemes or projects\n- No use of government resources for campaigning\n- Violation can lead to disqualification of candidates\n\nMCC ensures a level playing field for all parties! ⚖️';
  }

  return 'DEFAULT';
}

function appendMessage(sender, text) {
  var container = document.getElementById('chat-messages');
  if (!container) return;

  var div = document.createElement('div');
  div.className = 'message ' + (sender === 'bot' ? 'bot-message' : 'user-message');
  div.setAttribute('role', 'article');

  var formattedText = formatText(text);
  div.innerHTML =
    '<div class="message-avatar" aria-hidden="true">' + (sender === 'bot' ? '🤖' : '👤') + '</div>' +
    '<div class="message-content">' +
    '<p class="message-sender">' + (sender === 'bot' ? 'ElectroBot AI' : 'You') + '</p>' +
    '<div class="message-text">' + formattedText + '</div>' +
    '</div>';

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
    .replace(/^(<p>)?(.+)(<\/p>)?$/, '<p>$2</p>');
}

function showTyping(visible) {
  var indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.classList.toggle('hidden', !visible);
  var container = document.getElementById('chat-messages');
  if (container) container.scrollTop = container.scrollHeight;
}

function askQuick(question) {
  var input = document.getElementById('user-input');
  if (input) {
    input.value = question;
    sendMessage();
  }
}

// ============================================
// QUIZ
// ============================================
var quizQuestions = {
  en: [
    { q: 'What is the minimum age to vote in Indian elections?', options: ['16 years', '18 years', '21 years', '25 years'], correct: 1, icon: '🗓️' },
    { q: 'What does NOTA stand for in Indian elections?', options: ['No Official Tallied Answer', 'None of the Above', 'National Option Tally Act', 'Not on the Application'], correct: 1, icon: '❌' },
    { q: 'Which body conducts elections in India?', options: ['Supreme Court', 'Parliament', 'Election Commission of India', "President's Office"], correct: 2, icon: '🏛️' },
    { q: 'What is EPIC in Indian elections?', options: ['Electronic Party Identification Card', 'Electors Photo Identity Card', 'Election Process Identity Certificate', 'Electoral Poll Identification Code'], correct: 1, icon: '🆔' },
    { q: 'What is the Voter Helpline number in India?', options: ['100', '112', '1950', '1800'], correct: 2, icon: '📞' }
  ],
  hi: [
    { q: 'भारतीय चुनावों में मतदान करने की न्यूनतम आयु क्या है?', options: ['16 वर्ष', '18 वर्ष', '21 वर्ष', '25 वर्ष'], correct: 1, icon: '🗓️' },
    { q: 'भारतीय चुनावों में NOTA का क्या अर्थ है?', options: ['No Official Tallied Answer', 'इनमें से कोई नहीं (None of the Above)', 'National Option Tally Act', 'Not on the Application'], correct: 1, icon: '❌' },
    { q: 'भारत में चुनाव कौन सा निकाय आयोजित करता है?', options: ['सर्वोच्च न्यायालय', 'संसद', 'भारत निर्वाचन आयोग (ECI)', "राष्ट्रपति कार्यालय"], correct: 2, icon: '🏛️' },
    { q: 'भारतीय चुनावों में EPIC क्या है?', options: ['Electronic Party Identification Card', 'मतदाता फोटो पहचान पत्र', 'Election Process Identity Certificate', 'Electoral Poll Identification Code'], correct: 1, icon: '🆔' },
    { q: 'भारत में वोटर हेल्पलाइन नंबर क्या है?', options: ['100', '112', '1950', '1800'], correct: 2, icon: '📞' }
  ]
};

var currentQuestion = 0;
var score = 0;
var quizInitialized = false;

function initQuiz() {
  quizInitialized = true;
  currentQuestion = 0;
  score = 0;
  updateScoreDisplay();
  showQuestion();
}

function showQuestion() {
  const langQuestions = quizQuestions[currentLang];
  var q = langQuestions[currentQuestion];
  var qNum = document.getElementById('q-num');
  var progressFill = document.getElementById('progress-fill');
  var quizIcon = document.getElementById('quiz-icon');
  var questionText = document.getElementById('question-text');
  var optionsContainer = document.getElementById('options-container');
  var quizCard = document.getElementById('quiz-card');
  var quizResult = document.getElementById('quiz-result');

  if (qNum) qNum.textContent = currentQuestion + 1;
  if (progressFill) progressFill.style.width = (((currentQuestion + 1) / langQuestions.length) * 100) + '%';
  if (quizIcon) quizIcon.textContent = q.icon;
  if (questionText) questionText.textContent = q.q;

  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    q.options.forEach(function(opt, i) {
      var btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', function() { selectAnswer(i); });
      optionsContainer.appendChild(btn);
    });
  }

  if (quizCard) quizCard.classList.remove('hidden');
  if (quizResult) quizResult.classList.add('hidden');
}

function selectAnswer(selectedIndex) {
  const langQuestions = quizQuestions[currentLang];
  var q = langQuestions[currentQuestion];
  var btns = document.querySelectorAll('.option-btn');

  btns.forEach(function(btn, i) {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === selectedIndex && i !== q.correct) btn.classList.add('wrong');
  });

  if (selectedIndex === q.correct) {
    score++;
    updateScoreDisplay();
  }

  setTimeout(function() {
    currentQuestion++;
    if (currentQuestion < langQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function showResult() {
  const langQuestions = quizQuestions[currentLang];
  var quizCard = document.getElementById('quiz-card');
  var result = document.getElementById('quiz-result');
  if (quizCard) quizCard.classList.add('hidden');
  if (!result) return;
  result.classList.remove('hidden');

  var pct = Math.round((score / langQuestions.length) * 100);
  var icon, title, desc;

  if (currentLang === 'en') {
    if (pct >= 80) { icon = '🏆'; title = 'Excellent!'; desc = 'You scored ' + score + '/' + langQuestions.length; }
    else { icon = '📚'; title = 'Keep Learning!'; desc = 'You scored ' + score + '/' + langQuestions.length; }
  } else {
    if (pct >= 80) { icon = '🏆'; title = 'उत्कृष्ट!'; desc = 'आपने ' + score + '/' + langQuestions.length + ' स्कोर किया।'; }
    else { icon = '📚'; title = 'सीखते रहें!'; desc = 'आपने ' + score + '/' + langQuestions.length + ' स्कोर किया।'; }
  }

  var resultIcon = document.getElementById('result-icon');
  var resultTitle = document.getElementById('result-title');
  var resultDesc = document.getElementById('result-desc');
  if (resultIcon) resultIcon.textContent = icon;
  if (resultTitle) resultTitle.textContent = title;
  if (resultDesc) resultDesc.textContent = desc;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  quizInitialized = false;
  updateScoreDisplay();
  initQuiz();
}

function updateScoreDisplay() {
  const langQuestions = quizQuestions[currentLang];
  var scoreDisplay = document.getElementById('score-display');
  var totalDisplay = document.getElementById('total-display');
  if (scoreDisplay) scoreDisplay.textContent = score;
  if (totalDisplay) totalDisplay.textContent = langQuestions.length;
}

// ============================================
// MODAL SYSTEM
// ============================================
var guideDetails = {
  en: {
    "01": { title: "Check Your Eligibility", icon: "✅", details: "<h3>Who can vote?</h3><ul><li>Must be an Indian Citizen.</li><li>Must be 18+ years old.</li></ul>" },
    "02": { title: "How to Fill Form 6", icon: "📝", details: "<h3>Online Process:</h3><ol><li>Go to voterportal.eci.gov.in</li><li>Fill Form 6.</li></ol>" }
  },
  hi: {
    "01": { title: "पात्रता जाँचें", icon: "✅", details: "<h3>कौन वोट दे सकता है?</h3><ul><li>भारतीय नागरिक होना चाहिए।</li><li>18+ वर्ष की आयु होनी चाहिए।</li></ul>" },
    "02": { title: "फॉर्म 6 कैसे भरें", icon: "📝", details: "<h3>ऑनलाइन प्रक्रिया:</h3><ol><li>voterportal.eci.gov.in पर जाएं</li><li>फॉर्म 6 भरें।</li></ol>" }
  }
};

function openModal(id) {
  var data = guideDetails[currentLang][id];
  if (!data) return;

  var modal = document.getElementById('info-modal');
  var mIcon = document.getElementById('modal-icon');
  var mTitle = document.getElementById('modal-title');
  var mBody = document.getElementById('modal-body');

  if (mIcon) mIcon.textContent = data.icon;
  if (mTitle) mTitle.textContent = data.title;
  if (mBody) mBody.innerHTML = data.details;

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  var modal = document.getElementById('info-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Resume scroll
  }
}

// All event listeners initialization
document.addEventListener('DOMContentLoaded', function() {
  // ============================================
  // SIDEBAR LOGIC (Prioritized)
  // ============================================
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sideBtns = document.querySelectorAll('.side-btn');

  function toggleSidebar(open) {
    if (sidebar) sidebar.classList.toggle('open', open);
    if (sidebarOverlay) sidebarOverlay.classList.toggle('visible', open);
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  if (menuToggle) menuToggle.addEventListener('click', () => toggleSidebar(true));
  if (sidebarClose) sidebarClose.addEventListener('click', () => toggleSidebar(false));
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

  sideBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      showSection(section);
      sideBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      toggleSidebar(false);
    });
  });

  // REST OF THE LOGIC...
  // NAV BUTTONS
  document.querySelectorAll('.nav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      showSection(this.getAttribute('data-section'));
    });
  });

  // QUICK QUESTION CHIPS
  document.querySelectorAll('.chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      var question = this.getAttribute('data-question');
      if (question) askQuick(question);
    });
  });

  // CHAT - Send button click
  var sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', function() {
      sendMessage();
    });
  }

  // CHAT - Enter key in input
  var userInput = document.getElementById('user-input');
  if (userInput) {
    userInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // CHAT FORM - prevent default reload
  var chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      sendMessage();
    });
  }

  // RESTART QUIZ BUTTON
  var restartBtn = document.getElementById('restart-quiz-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', function() {
      restartQuiz();
    });
  }

  // GUIDE CARDS CLICK
  document.querySelectorAll('.guide-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var id = this.querySelector('.step-num').textContent;
      openModal(id);
    });
  });

  // MODAL CLOSE
  var closeBtn = document.getElementById('modal-close');
  var overlay = document.getElementById('modal-overlay');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // Init app
  showSection('chat');



  // ============================================
  // THEME & LANGUAGE TOGGLES
  // ============================================
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') body.classList.add('light-theme');

  // Theme
  document.querySelectorAll('.btn-theme').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      body.classList.toggle('light-theme');
      localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });
  });

  // Language
  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      currentLang = currentLang === 'en' ? 'hi' : 'en';
      localStorage.setItem('lang', currentLang);
      updateUI();
    });
  });

  // Initial UI Update
  updateUI();

  console.log('🗳️ ElectroBot AI initialized successfully!');
});
