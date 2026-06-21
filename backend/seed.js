const bcrypt = require('bcrypt');
const { User, sequelize } = require('./src/models');

async function seed() {
  try {
    // Ensure connection is established
    await sequelize.authenticate();
    console.log('Connected to database for seeding...');

    // Synchronize models (ensure table exists)
    await sequelize.sync({ alter: true });

    const adminEmail = 'admin@accountantfirst.com';
    const adminPassword = 'Password123';
    const saltRounds = 10;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: adminEmail } });
    if (existingUser) {
      console.log('Admin user already exists. Skipping seed.');
      return;
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    
    await User.create({
      firstName: 'Admin',
      lastName: 'Account',
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'admin',
      isActive: true
    });

    console.log(`✅ Success! Seeded user: ${adminEmail} / ${adminPassword}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
