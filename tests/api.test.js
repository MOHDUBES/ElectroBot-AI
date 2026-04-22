const request = require('supertest');
const app = require('../server'); // Using the actual app exported from server.js

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
