// test-user.js
const connectDB = require('./src/config/db');
const User = require('./src/models/User.model');
const mongoose = require('mongoose');

async function runCheck() {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Clear old test record if it exists
    await User.deleteMany({ username: 'admin_test_1' });

    // 3. Persist a sample User
    const testUser = await User.create({
      name: 'Isuho',
      username: 'admin_test_1',
      password: 'password123',
      role: 'ADMIN',
    });

    console.log('✅ User successfully persisted! ID:', testUser._id);
  } catch (error) {
    console.error('❌ Persistence test failed:', error.message);
  } finally {
    // 4. Disconnect cleanly
    await mongoose.disconnect();
    process.exit(0);
  }
}

runCheck();