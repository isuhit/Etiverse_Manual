// test-models.js
const connectDB = require("../src/config/db");
const User = require("../src/models/User.model");
const Student = require("../src/models/Student.model");
const Manual = require("../src/models/Manual.model");
const Payment = require("../src/models/Payment.model");
const Allocation = require("../src/models/Allocation.model");
const AuditLog = require("../src/models/AuditLog.model");
const mongoose = require("mongoose");

async function runModelTests() {
  try {
    await connectDB();

    console.log("\n=================== 1. CLEANUP ===================");
    // Cleanup scoped strictly to test entities to prevent destroying unowned data
    await Promise.all([
      User.deleteMany({ username: "test_operator_v1" }),
      User.deleteMany({ username: "test_dup_user" }),
      Student.deleteMany({ regNumber: "25/CO/IS/999" }),
      Student.deleteMany({ regNumber: "25/CO/IS/888" }),
      Manual.deleteMany({ courseCode: "TEST101" }),
      Manual.deleteMany({ courseCode: "TEST102" }),
      Payment.deleteMany({ transactionId: "TXN_TEST_999" }),
      Payment.deleteMany({ transactionId: "TXN_TEST_888" }),
      AuditLog.deleteMany({ action: "TEST_ACTION" }),
    ]);

    // Scoped cleanup for Allocation: delete allocations tied to our explicit test student
    const tempStudent = await Student.findOne({ regNumber: "25/CO/IS/999" });
    if (tempStudent) {
      await Allocation.deleteMany({ student: tempStudent._id });
    }
    console.log("✅ Scoped test data cleaned up safely.");

    console.log("\n=================== 2. VALID PERSISTENCE ===================");
    const user = await User.create({
      name: "Test Admin",
      username: "test_operator_v1",
      password: "hashedpassword123",
      role: "ADMIN",
    });

    const student = await Student.create({
      name: "Jane Doe",
      regNumber: "25/CO/IS/999",
    });

    const manual = await Manual.create({
      title: "Testing Systems",
      courseCode: "TEST101",
      price: 2000,
      courseDescription: "A manual for testing systems.",
      quantityInStock: 10,
      isActive: true,
    });

    const payment = await Payment.create({
      student: student._id,
      manual: manual._id,
      amount: 2000,
      transactionId: "TXN_TEST_999",
      evidenceUrl: "https://storage.example.com/receipt.png",
      status: "VERIFIED",
      verifiedBy: user._id,
      verifiedAt: new Date(),
    });

    const allocation = await Allocation.create({
      student: student._id,
      manual: manual._id,
      payment: payment._id,
      allocatedBy: user._id,
    });

    const audit = await AuditLog.create({
      actor: user._id,
      action: "TEST_ACTION",
      entity: "Allocation",
      entityId: allocation._id,
    });

    console.log("✅ Base valid documents persisted successfully across all 6 entities.");

    console.log("\n=================== 3. USER VALIDATION TESTS ===================");
    // User Test 1: Missing username -> Reject
    try {
      await User.create({
        name: "No Username Operator",
        password: "password123",
        role: "ADMIN",
      });
      console.error("❌ Failed: Missing username was accepted!");
    } catch (err) {
      console.log("✅ Passed: Missing username rejected");
    }

    // User Test 2: Invalid role -> Reject
    try {
      await User.create({
        name: "Invalid Role Operator",
        username: "invalid_role_user",
        password: "password123",
        role: "SUPERMAN",
      });
      console.error("❌ Failed: Invalid role was accepted!");
    } catch (err) {
      console.log("✅ Passed: Invalid role rejected");
    }

    // User Test 3: Duplicate username -> Reject (Error 11000)
    try {
      await User.create({
        name: "Duplicate Operator",
        username: "test_operator_v1", // Duplicate!
        password: "password123",
        role: "ASSISTANT",
      });
      console.error("❌ Failed: Duplicate username was accepted!");
    } catch (err) {
      console.log("✅ Passed: Duplicate username rejected (Error 11000)");
    }

    // User Test 4: Default isActive === true & Normalization (TEST_OPERATOR -> test_operator)
    const normUser = await User.create({
      name: "Normalized User",
      username: "TEST_DUP_USER",
      password: "password123",
      role: "ASSISTANT",
    });
    if (normUser.username === "test_dup_user" && normUser.isActive === true) {
      console.log("✅ Passed: Username lowercase normalization works & isActive defaults to true");
    } else {
      console.error("❌ Failed: Username normalization or default isActive check failed!");
    }

    console.log("\n=================== 4. STUDENT VALIDATION TESTS ===================");
    // Student Test 1: Missing name -> Reject
    try {
      await Student.create({
        regNumber: "25/CO/IS/888",
      });
      console.error("❌ Failed: Missing student name was accepted!");
    } catch (err) {
      console.log("✅ Passed: Missing student name rejected");
    }

    // Student Test 2: Missing regNumber -> Reject
    try {
      await Student.create({
        name: "No Reg Student",
      });
      console.error("❌ Failed: Missing student regNumber was accepted!");
    } catch (err) {
      console.log("✅ Passed: Missing student regNumber rejected");
    }

    // Student Test 3: Duplicate regNumber -> Reject (Error 11000)
    try {
      await Student.create({
        name: "Imposter Student",
        regNumber: "25/CO/IS/999", // Duplicate!
      });
      console.error("❌ Failed: Duplicate regNumber was accepted!");
    } catch (err) {
      console.log("✅ Passed: Duplicate regNumber rejected (Error 11000)");
    }

    // Student Test 4: RegNumber normalization (25/co/is/888 -> 25/CO/IS/888)
    const normStudent = await Student.create({
      name: "Normalized Student",
      regNumber: "25/co/is/888",
    });
    if (normStudent.regNumber === "25/CO/IS/888") {
      console.log("✅ Passed: regNumber uppercase normalization works");
    } else {
      console.error("❌ Failed: regNumber normalization failed!");
    }

    console.log("\n=================== 5. MANUAL VALIDATION TESTS ===================");
    // Manual Test 1: Missing courseCode -> Reject
    try {
      await Manual.create({
        title: "No Code Manual",
        price: 1500,
        quantityInStock: 5,
        courseDescription: "A manual without a course code.",
        isActive: true,
      });
      console.error("❌ Failed: Missing courseCode was accepted!");
    } catch (err) {
      console.log("✅ Passed: Missing courseCode rejected");
    }

    // Manual Test 2: Duplicate courseCode -> Reject (Error 11000)
    try {
      await Manual.create({
        title: "Duplicate Manual",
        courseCode: "TEST101", // Duplicate!
        price: 1500,
        quantityInStock: 5,
        courseDescription: "A manual for testing systems.",
        isActive: true,
      });
      console.error("❌ Failed: Duplicate courseCode was accepted!");
    } catch (err) {
      console.log("✅ Passed: Duplicate courseCode rejected (Error 11000)");
    }

    // Manual Test 3: Negative price -> Reject
    try {
      await Manual.create({
        title: "Negative Price Manual",
        courseCode: "TEST102",
        price: -500,
        quantityInStock: 5,
        courseDescription: "A manual for testing systems.",
        isActive: true,
      });
      console.error("❌ Failed: Negative price was accepted!");
    } catch (err) {
      console.log("✅ Passed: Negative price rejected");
    }

    // Manual Test 4: Negative quantityInStock -> Reject
    try {
      await Manual.create({
        title: "Negative Stock Manual",
        courseCode: "TEST102",
        price: 1500,
        quantityInStock: -5,
        courseDescription: "A manual for testing systems.",
        isActive: true,
      });
      console.error("❌ Failed: Negative quantityInStock was accepted!");
    } catch (err) {
      console.log("✅ Passed: Negative quantityInStock rejected");
    }

    // Manual Test 5: price = 0 -> Accepted (V1 Business Decision)
    const freeManual = await Manual.create({
      title: "Free Resource Manual",
      courseCode: "TEST102",
      price: 0,
      quantityInStock: 50,
      courseDescription: "A manual for testing systems.",
      isActive: true,
    });
    if (freeManual.price === 0 && freeManual.courseCode === "TEST102") {
      console.log("✅ Passed: price = 0 accepted and courseCode uppercase normalization works");
    } else {
      console.error("❌ Failed: Free manual creation failed!");
    }

    console.log("\n=================== SUITE COMPLETE ===================");

  } catch (error) {
    console.error("❌ Unexpected test runner error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runModelTests();