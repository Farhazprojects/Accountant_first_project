const request = require('supertest');
const app = require('../../src/app'); // Import your Express app entry
const { sequelize, User, Client, Proposal } = require('../../src/models');

describe('🚀 Core Accounting SaaS Operational Pipeline', () => {
  let authToken;
  let targetClientId;
  let targetProposalId;

  // Clean up database schemas and provision dummy admin prior to testing
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.destroy({ where: {} });
    await Client.destroy({ where: {} });
    await Proposal.destroy({ where: {} });

    // Seed a standard administrator (passwordHash maps to default text: 'Password123')
    const admin = await User.create({
      email: 'qa@accountantfirst.com',
      passwordHash: '$2b$10$pVumdj0avOljVET.QzuHhOm5KhPCANeUQO4ppS37G63i5lc7KbvXa',
      firstName: 'Quality',
      lastName: 'Assurance',
      role: 'admin',
      isActive: true
    });
  });

  // Test Milestone 1: Authentication Engine
  it('should successfully authenticate the admin and return a valid JWT', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'qa@accountantfirst.com',
        password: 'Password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('token');
    authToken = response.body.data.token; // Pass token forward to safeguard secured tracks
  });

  // Test Milestone 2: Secured Client Creation
  it('should block non-authenticated creations and allow verified administrative builds', async () => {
    // 1. Verify standard blockage rule without token header
    const blockedResponse = await request(app)
      .post('/api/onboarding/clients')
      .send({ name: 'Stark Industries', email: 'tony@stark.com' });
    expect(blockedResponse.statusCode).toBe(401);

    // 2. Perform authenticated creation post-clearance
    const cleanResponse = await request(app)
      .post('/api/onboarding/clients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Stark Industries',
        email: 'tony@stark.com',
        phone: '555-0199'
      });

    expect(cleanResponse.statusCode).toBe(201);
    expect(cleanResponse.body.data.client).toHaveProperty('id');
    targetClientId = cleanResponse.body.data.client.id;
  });

  // Test Milestone 3: Proposal Drafting Execution
  it('should generate a pending proposal contract baseline for the client', async () => {
    const response = await request(app)
      .post(`/api/proposals`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clientId: targetClientId,
        title: 'Annual Corporate Bookkeeping Scope',
        totalAmount: 850.00
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.proposal.status).toBe('pending');
    targetProposalId = response.body.data.proposal.id;
  });

  // Test Milestone 4: Client Signature & Downstream Stamping Automation
  it('should process client base64 signatures, compile the PDF, write to S3, and map Xero IDs', async () => {
    const response = await request(app)
      .post(`/api/proposals/${targetProposalId}/accept`)
      // Public route endpoint; signature execution bypasses internal token headers
      .send({
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('documentUrl');
    expect(response.body.data.documentUrl).toMatch(/signed-proposal.*\.pdf/);

    // Confirm core records cleanly mutated states in local engine tables
    const freshProposal = await Proposal.findByPk(targetProposalId);
    expect(freshProposal.status).toBe('accepted');

    const freshClient = await Client.findByPk(targetClientId);
    expect(freshClient.xeroContactId).toBe('xero-contact-mock-12345');
  });
});