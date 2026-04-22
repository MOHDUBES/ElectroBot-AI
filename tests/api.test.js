const request = require('supertest');
const express = require('express');

// Mock server for testing
const app = express();
app.use(express.json());
app.post('/api/chat', (req, res) => {
  if (!req.body.message) return res.status(400).json({ error: 'Message required' });
  res.json({ response: 'Test AI Response' });
});

describe('API Endpoints', () => {
  it('should return 400 if message is missing', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should return 200 and a response for a valid message', async () => {
    const res = await request(app).post('/api/chat').send({ message: 'Hello' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toBeDefined();
  });
});
