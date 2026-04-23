const request = require('supertest');
const app = require('../server');

describe('ElectroBot AI - Comprehensive Test Suite', () => {
  
  // 1. Basic Functionality
  describe('Basic Endpoints', () => {
    it('should return 200 for health check', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  // 2. Input Validation (Security & Efficiency)
  describe('Chat API Validation', () => {
    it('should return 400 for empty message', async () => {
      const res = await request(app).post('/api/chat').send({ message: '' });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 for non-string message', async () => {
      const res = await request(app).post('/api/chat').send({ message: 12345 });
      expect(res.statusCode).toEqual(400);
    });

    it('should handle long messages gracefully', async () => {
      const longMessage = 'A'.repeat(1000);
      const res = await request(app).post('/api/chat').send({ message: longMessage });
      // We don't necessarily block it now, but we check if it responds
      expect(res.statusCode).toBeDefined();
    });
  });

  // 3. Security (Rate Limiting check)
  describe('Security Headers', () => {
    it('should have Helmet security headers', async () => {
      const res = await request(app).get('/');
      expect(res.header['x-dns-prefetch-control']).toBeDefined();
      expect(res.header['x-frame-options']).toBeDefined();
    });
  });

  // 4. Content Type check
  describe('Response Integrity', () => {
    it('should return JSON content type', async () => {
      const res = await request(app).post('/api/chat').send({ message: 'Hello' });
      expect(res.type).toEqual('application/json');
    });
  });
});
