/**
 * ElectroBot AI - Election Education App
 * Powered by Google Gemini AI
 * PromptWars Hackathon - Challenge 2
 */

'use strict';

// ============================================
// THEME TOGGLE - Dark/Light mode logic
// ============================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-theme');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  });
}

/**
 * Switches between different SPA sections.
 * @param {string} name - The ID suffix of the section to show.
 */
function showSection(name) {
  document.querySelectorAll('.section').forEach(function(s) {
    s.classList.remove('active');
  });
  document.querySelectorAll('.nav-btn').forEach(function(b) {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });

  var section = document.getElementById('section-' + name);
  var btn = document.getElementById('nav-' + name);

  if (section) section.classList.add('active');
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-current', 'page');
  }

  if (name === 'quiz') initQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Communicates with the secure backend proxy to get AI responses.
 * @param {string} userMessage - The query text.
 * @returns {Promise<string>} The AI response.
 */
function callGeminiAPI(userMessage) {
  return fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    if (data.fallback || data.error) return getFallbackResponse(userMessage);
    return data.response || getFallbackResponse(userMessage);
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
    .catch(function() {
      showTyping(false);
      appendMessage('bot', getFallbackResponse(text));
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
var quizQuestions = [
  { q: 'What is the minimum age to vote in Indian elections?', options: ['16 years', '18 years', '21 years', '25 years'], correct: 1, icon: '🗓️' },
  { q: 'What does NOTA stand for in Indian elections?', options: ['No Official Tallied Answer', 'None of the Above', 'National Option Tally Act', 'Not on the Application'], correct: 1, icon: '❌' },
  { q: 'Which body conducts elections in India?', options: ['Supreme Court', 'Parliament', 'Election Commission of India', "President's Office"], correct: 2, icon: '🏛️' },
  { q: 'What is EPIC in Indian elections?', options: ['Electronic Party Identification Card', 'Electors Photo Identity Card', 'Election Process Identity Certificate', 'Electoral Poll Identification Code'], correct: 1, icon: '🆔' },
  { q: 'What is the Voter Helpline number in India?', options: ['100', '112', '1950', '1800'], correct: 2, icon: '📞' },
  { q: 'VVPAT stands for what?', options: ['Voter Verified Paper Audit Trail', 'Verified Voting Paper Authority Trail', 'Vote Verification Paper And Tally', 'Voter Validated Polling Audit Track'], correct: 0, icon: '📄' },
  { q: 'Which Form is used for new voter registration in India?', options: ['Form 3', 'Form 6', 'Form 9', 'Form 12'], correct: 1, icon: '📝' },
  { q: 'When was the Election Commission of India established?', options: ['1947', '1948', '1950', '1952'], correct: 2, icon: '📅' }
];

var currentQuestion = 0;
var score = 0;
var quizInitialized = false;

function initQuiz() {
  if (quizInitialized) return;
  quizInitialized = true;
  currentQuestion = 0;
  score = 0;
  updateScoreDisplay();
  showQuestion();
}

function showQuestion() {
  var q = quizQuestions[currentQuestion];
  var qNum = document.getElementById('q-num');
  var progressFill = document.getElementById('progress-fill');
  var quizIcon = document.getElementById('quiz-icon');
  var questionText = document.getElementById('question-text');
  var optionsContainer = document.getElementById('options-container');
  var quizCard = document.getElementById('quiz-card');
  var quizResult = document.getElementById('quiz-result');

  if (qNum) qNum.textContent = currentQuestion + 1;
  if (progressFill) progressFill.style.width = (((currentQuestion + 1) / quizQuestions.length) * 100) + '%';
  if (quizIcon) quizIcon.textContent = q.icon;
  if (questionText) questionText.textContent = q.q;

  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    q.options.forEach(function(opt, i) {
      var btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.addEventListener('click', function() { selectAnswer(i); });
      optionsContainer.appendChild(btn);
    });
  }

  if (quizCard) quizCard.classList.remove('hidden');
  if (quizResult) quizResult.classList.add('hidden');
}

function selectAnswer(selectedIndex) {
  var q = quizQuestions[currentQuestion];
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
    if (currentQuestion < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function showResult() {
  var quizCard = document.getElementById('quiz-card');
  var result = document.getElementById('quiz-result');
  if (quizCard) quizCard.classList.add('hidden');
  if (!result) return;
  result.classList.remove('hidden');

  var pct = Math.round((score / quizQuestions.length) * 100);
  var icon, title, desc;

  if (pct >= 80) {
    icon = '🏆'; title = 'Excellent! ' + pct + '% Score';
    desc = 'Outstanding! You scored ' + score + '/' + quizQuestions.length + '. Share with friends to promote civic awareness! 🇮🇳';
  } else if (pct >= 60) {
    icon = '👍'; title = 'Good Job! ' + pct + '% Score';
    desc = 'You scored ' + score + '/' + quizQuestions.length + '. Keep learning with ElectroBot AI!';
  } else {
    icon = '📚'; title = 'Keep Learning! ' + pct + '% Score';
    desc = 'You scored ' + score + '/' + quizQuestions.length + '. Check the Voter Guide and try again! 💪';
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
  var scoreDisplay = document.getElementById('score-display');
  var totalDisplay = document.getElementById('total-display');
  if (scoreDisplay) scoreDisplay.textContent = score;
  if (totalDisplay) totalDisplay.textContent = quizQuestions.length;
}

// ============================================
// MODAL SYSTEM
// ============================================
var guideDetails = {
  "01": {
    title: "Check Your Eligibility",
    icon: "✅",
    details: "<h3>Who can vote?</h3><ul><li>Must be an Indian Citizen.</li><li>Must have turned 18 on or before January 1st of the year of electoral roll revision.</li><li>Must be an ordinary resident of the polling area where you want to register.</li><li>Must not be disqualified due to unsound mind or criminal records.</li></ul><p>If you meet these, you are ready to be a part of the world's largest democracy!</p>"
  },
  "02": {
    title: "How to Fill Form 6",
    icon: "📝",
    details: "<h3>Online Process:</h3><ol><li>Go to <strong>voterportal.eci.gov.in</strong> or use the 'Voter Helpline' App.</li><li>Register with your mobile number.</li><li>Select 'New Voter Registration' and choose Form 6.</li><li>Enter your details carefully as per your documents.</li></ol><p>Make sure all names and dates match your Aadhaar or Birth Certificate!</p>"
  },
  "03": {
    title: "Documents Required",
    icon: "📄",
    details: "<h3>Primary Documents:</h3><ul><li><strong>Identity:</strong> Aadhaar Card, PAN Card, Driving License.</li><li><strong>Address:</strong> Water/Electricity/Gas bill (at least 1 year), Passbook of Bank/Post Office, Passport.</li><li><strong>Age Proof:</strong> Birth Certificate, 10th Standard Marksheet.</li><li><strong>Photo:</strong> Recent passport size color photograph with white background.</li></ul>"
  },
  "04": {
    title: "The EPIC (Voter ID) Card",
    icon: "🆔",
    details: "<h3>Your Digital Identity</h3><p>After your application is verified by the Booth Level Officer (BLO), you will receive an EPIC Number via SMS.</p><ul><li>You can download the <strong>e-EPIC</strong> (digital card) instantly from the ECI website.</li><li>The physical card will be delivered to your address via Speed Post.</li></ul><p><em>Note: Even if you don't have the card yet, you can vote if your name is in the Electoral Roll!</em></p>"
  },
  "05": {
    title: "Find Your Polling Booth",
    icon: "🏛️",
    details: "<h3>Locating your Station:</h3><p>You can find your polling booth in 3 easy ways:</p><ul><li><strong>Online:</strong> Visit electoralsearch.eci.gov.in and enter your EPIC number.</li><li><strong>SMS:</strong> SMS <code>ECI &lt;EPIC Number&gt;</code> to <strong>1950</strong>.</li><li><strong>App:</strong> Use the 'Voter Helpline' app to find your booth on the map.</li></ul>"
  },
  "06": {
    title: "How to Cast Your Vote",
    icon: "🗳️",
    details: "<h3>Step-by-Step at the Booth:</h3><ol><li>First polling official checks your name in the list and ID.</li><li>Second official marks your finger with <strong>Indelible Ink</strong> and takes your signature.</li><li>Third official takes the slip and enables the EVM.</li><li>Go to the voting compartment, press the blue button next to your candidate's symbol on the <strong>EVM</strong>.</li><li>Check the <strong>VVPAT</strong> screen for 7 seconds to confirm your vote!</li></ol>"
  }
};

function openModal(id) {
  var data = guideDetails[id];
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
    document.body.style.overflow = 'hidden'; // Stop scroll
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
  console.log('🗳️ ElectroBot AI initialized successfully!');
});
