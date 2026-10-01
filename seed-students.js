// seed-students.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const connectDB = require('./src/config/db');
const Student = require('./src/models/Student.model');
const mongoose = require('mongoose');

async function seedStudents() {
  try {
    await connectDB();

    const students = [];
    const csvFilePath = path.join(__dirname, 'students.csv');

    if (!fs.existsSync(csvFilePath)) {
      console.error('❌ Error: students.csv not found in root directory.');
      process.exit(1);
    }

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Extract values using your exact CSV header names: "REG NO" and "NAMES"
        const rawReg = row['REG NO'] || row['regNo'] || row['regNumber'];
        const rawName = row['NAMES'] || row['name'] || row['Name'];

        if (rawReg && rawName) {
          students.push({
            name: rawName.trim(),
            regNumber: rawReg.trim().toUpperCase(), // Normalizes to uppercase (e.g., '25/CO/IS/007')
          });
        }
      })
      .on('end', async () => {
        console.log(`\n=================== SEEDING DATASET ===================`);
        console.log(`📄 Parsed ${students.length} student records from CSV.`);

        if (students.length === 0) {
          console.warn('⚠️ No valid student records found to seed.');
          await mongoose.disconnect();
          process.exit(0);
        }

        try {
          // ordered: false ensures duplicate regNumbers are skipped without stopping execution
          const result = await Student.insertMany(students, { ordered: false });
          console.log(`✅ Successfully seeded ${result.length} student records into MongoDB!`);
        } catch (error) {
          if (error.code === 11000 || error.writeErrors) {
            const insertedCount = error.insertedDocs ? error.insertedDocs.length : 0;
            console.log(`⚠️ Seeding completed. Inserted ${insertedCount} new records (duplicates skipped).`);
          } else {
            console.error('❌ Database insertion error:', error.message);
          }
        } finally {
          await mongoose.disconnect();
          console.log(`=======================================================\n`);
          process.exit(0);
        }
      });
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
}

seedStudents();