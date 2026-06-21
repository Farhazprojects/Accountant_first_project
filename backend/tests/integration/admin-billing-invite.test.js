process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_integration';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
process.env.STRIPE_PRICE_GROWTH = process.env.STRIPE_PRICE_GROWTH || 'price_growth_test_123';

jest.mock('stripe', () => {
  return jest.fn(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_test_123' }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/test-session' }),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://billing.stripe.com/test-portal' }),
      },
    },
  }));
});

const request = require('supertest');
const app = require('../../src/app');
const { sequelize, User, Firm } = require('../../src/models');

describe('Admin Invite + Billing endpoints', () => {
  let authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.destroy({ where: {} });
    await Firm.destroy({ where: {} });

    await User.create({
      email: 'admin@accountantfirst.com',
      passwordHash: '$2b$10$pVumdj0avOljVET.QzuHhOm5KhPCANeUQO4ppS37G63i5lc7KbvXa', // Password123
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@accountantfirst.com', password: 'Password123' });

    authToken = loginResponse.body.data.token;
  });

  it('invites staff and creates inactive pending user', async () => {
    const response = await request(app)
      .post('/api/users/invite')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        firstName: 'New',
        lastName: 'Staff',
        email: 'new.staff@accountantfirst.com',
        role: 'staff',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.user.email).toBe('new.staff@accountantfirst.com');
    expect(response.body.data.user.isActive).toBe(false);

    const invitedUser = await User.findOne({ where: { email: 'new.staff@accountantfirst.com' } });
    expect(invitedUser).not.toBeNull();
    expect(invitedUser.isActive).toBe(false);
  });

  it('returns billing status payload', async () => {
    const response = await request(app)
      .get('/api/billing/status')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('status');
    expect(response.body.data).toHaveProperty('plan');
  });

  it('creates checkout session URL for subscribe flow', async () => {
    const response = await request(app)
      .post('/api/billing/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ priceId: 'price_growth_test_123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.checkoutUrl).toBe('https://checkout.stripe.com/test-session');
  });
});
