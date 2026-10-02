// test-auth-service.js
const connectDB = require('../src/config/db');
const User = require('../src/models/User.model');
const { authenticateUser } = require('../src/services/auth.service'); // Adjust path to match your service location
const mongoose = require('mongoose');
const auth = require("../src/utils/auth.utils"); 

async function runAuthTests() {
  try {
    await connectDB();

    // 1. Clean up old test data
    await User.deleteMany({ username: { $in: ['test_active', 'test_inactive'] } });

    // 2. Setup test fixture accounts (pre-save hook automatically hashes passwords)
    await User.create({
      name: 'Active Test Operator',
      username: 'test_active',
      password: 'password123',
      role: 'ADMIN',
      isActive: true,
    });

    await User.create({
      name: 'Inactive Test Operator',
      username: 'test_inactive',
      password: 'password123',
      role: 'ASSISTANT',
      isActive: false,
    });

    console.log('🧪 --- STARTING CREDENTIAL VERIFICATION TESTS ---\n');

    // TEST 1: Correct username + correct password -> Returns user
    try {
      const user = await authenticateUser('test_active', 'password123');
      console.log('✅ Test 1 Passed: Valid credentials returned user ->', user.username);
    } catch (err) {
      console.error('❌ Test 1 Failed:', err.message);
    }

    // TEST 2: Correct username + wrong password -> 401 Rejection
    try {
      await authenticateUser('test_active', 'wrongpassword');
      console.error('❌ Test 2 Failed: Allowed wrong password!');
    } catch (err) {
      console.log(`✅ Test 2 Passed: Wrong password rejected [Status ${err.statusCode || 401}] -> ${err.message}`);
    }

    // TEST 3: Unknown username -> 401 Rejection
    try {
      await authenticateUser('unknown_user', 'password123');
      console.error('❌ Test 3 Failed: Allowed unknown username!');
    } catch (err) {
      console.log(`✅ Test 3 Passed: Unknown user rejected [Status ${err.statusCode || 401}] -> ${err.message}`);
    }

    // TEST 4: Inactive user + correct password -> Rejection
    try {
      await authenticateUser('test_inactive', 'password123');
      console.error('❌ Test 4 Failed: Allowed inactive user login!');
    } catch (err) {
      console.log(`✅ Test 4 Passed: Inactive user rejected [Status ${err.statusCode || 401}] -> ${err.message}`);
    }

        // TEST 5: Correct username + correct password -> Returns user and jwt
    try {
      const user = await authenticateUser('test_active', 'password123');
      const token = auth.generateToken(user.username, user._id, user.role);
      console.log('✅ Test 5 Passed: Valid credentials returned user and token ->', user.username, 'Token:', token);
    } catch (err) {
      console.error('❌ Test 5 Failed:', err.message);
    }
   

  } catch (error) {
    console.error('❌ Execution Error:', error);
  } finally {
    // Clean up and disconnect cleanly
    // await User.deleteMany({ username: { $in: ['test_active', 'test_inactive'] } });
    await mongoose.disconnect();
    process.exit(0);
  }
}

runAuthTests();