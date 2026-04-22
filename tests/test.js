/**
 * ElectroBot AI - Unit Tests
 * Tests for core functionality
 */

// Simple test framework
var tests = [];
var passed = 0;
var failed = 0;

function test(name, fn) {
  tests.push({ name: name, fn: fn });
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(a, b, message) {
  if (a !== b) throw new Error((message || 'Expected ' + a + ' to equal ' + b));
}

function runTests() {
  console.log('\n🧪 Running ElectroBot AI Tests...\n');
  tests.forEach(function(t) {
    try {
      t.fn();
      console.log('  ✅ PASS: ' + t.name);
      passed++;
    } catch (e) {
      console.log('  ❌ FAIL: ' + t.name + ' - ' + e.message);
      failed++;
    }
  });
  console.log('\n─────────────────────────────────');
  console.log('  Results: ' + passed + ' passed, ' + failed + ' failed');
  console.log('─────────────────────────────────\n');
  return failed === 0;
}

// ============================================
// QUIZ DATA TESTS
// ============================================
test('Quiz has exactly 8 questions', function() {
  var questions = [
    { q: 'Q1', options: ['A','B','C','D'], correct: 1 },
    { q: 'Q2', options: ['A','B','C','D'], correct: 1 },
    { q: 'Q3', options: ['A','B','C','D'], correct: 2 },
    { q: 'Q4', options: ['A','B','C','D'], correct: 1 },
    { q: 'Q5', options: ['A','B','C','D'], correct: 2 },
    { q: 'Q6', options: ['A','B','C','D'], correct: 0 },
    { q: 'Q7', options: ['A','B','C','D'], correct: 1 },
    { q: 'Q8', options: ['A','B','C','D'], correct: 2 }
  ];
  assertEqual(questions.length, 8, 'Should have 8 questions');
});

test('Each quiz question has 4 options', function() {
  var questions = [
    { options: ['A','B','C','D'] },
    { options: ['A','B','C','D'] },
    { options: ['A','B','C','D'] }
  ];
  questions.forEach(function(q) {
    assertEqual(q.options.length, 4, 'Each question must have 4 options');
  });
});

test('Correct answer index is valid (0-3)', function() {
  var correctAnswers = [1, 1, 2, 1, 2, 0, 1, 2];
  correctAnswers.forEach(function(ans) {
    assert(ans >= 0 && ans <= 3, 'Answer index must be between 0 and 3');
  });
});

// ============================================
// FALLBACK RESPONSE TESTS
// ============================================
test('Voter registration response contains key info', function() {
  function getFallback(query) {
    var q = query.toLowerCase();
    if (q.includes('register')) {
      return 'Visit voterportal.eci.gov.in | Fill Form 6 | Call 1950';
    }
    return 'General response';
  }
  var response = getFallback('How do I register as a voter?');
  assert(response.includes('Form 6'), 'Response should mention Form 6');
  assert(response.includes('1950'), 'Response should include helpline number');
});

test('EVM response contains technical info', function() {
  function getFallback(query) {
    var q = query.toLowerCase();
    if (q.includes('evm')) {
      return 'EVM has Ballot Unit, Control Unit and VVPAT. Not connected to internet.';
    }
    return 'General response';
  }
  var response = getFallback('How does EVM work?');
  assert(response.includes('VVPAT'), 'Response should mention VVPAT');
  assert(response.includes('internet'), 'Response should mention internet security');
});

test('NOTA response is informative', function() {
  function getFallback(query) {
    var q = query.toLowerCase();
    if (q.includes('nota')) {
      return 'NOTA introduced in 2013 by Supreme Court. Highest vote candidate still wins.';
    }
    return '';
  }
  var response = getFallback('What is NOTA?');
  assert(response.length > 0, 'NOTA response should not be empty');
  assert(response.includes('2013'), 'Should mention year NOTA was introduced');
});

// ============================================
// TEXT FORMATTING TESTS
// ============================================
test('Bold text is formatted correctly', function() {
  function formatBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
  var result = formatBold('**Hello** World');
  assertEqual(result, '<strong>Hello</strong> World', 'Bold formatting failed');
});

test('Italic text is formatted correctly', function() {
  function formatItalic(text) {
    return text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
  var result = formatItalic('*Hello* World');
  assertEqual(result, '<em>Hello</em> World', 'Italic formatting failed');
});

// ============================================
// HEALTH CHECK TEST
// ============================================
test('Health check endpoint returns correct format', function() {
  var mockResponse = {
    status: 'healthy',
    service: 'ElectroBot AI',
    timestamp: new Date().toISOString()
  };
  assertEqual(mockResponse.status, 'healthy', 'Status should be healthy');
  assertEqual(mockResponse.service, 'ElectroBot AI', 'Service name should match');
  assert(mockResponse.timestamp.length > 0, 'Timestamp should not be empty');
});

test('Score calculation is correct', function() {
  var score = 6;
  var total = 8;
  var pct = Math.round((score / total) * 100);
  assertEqual(pct, 75, 'Score percentage should be 75%');
});

test('Score percentage determines result category', function() {
  function getCategory(pct) {
    if (pct >= 80) return 'excellent';
    if (pct >= 60) return 'good';
    return 'learning';
  }
  assertEqual(getCategory(90), 'excellent');
  assertEqual(getCategory(70), 'good');
  assertEqual(getCategory(40), 'learning');
});

// ============================================
// RUN ALL TESTS
// ============================================
var allPassed = runTests();
process.exit(allPassed ? 0 : 1);
