
async function test() {
  console.log('Testing local server at http://localhost:8080/api/chat...');
  try {
    const res = await fetch('http://localhost:8080/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is NOTA?' })
    });
    const data = await res.json();
    console.log('Response status:', res.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

test();
