const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../.env")
});

// Register ALL models before using populate
const User = require("../models/User");
const Student = require("../models/Student");
const Request = require("../models/Request");
const Document = require("../models/Document");
const LockerDocument = require("../models/LockerDocument");

async function syncLocker() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const documents = await Document.find({});

    console.log(`Found ${documents.length} Document records`);

    let added = 0;
    let skipped = 0;

    for (const document of documents) {
      console.log(`\nChecking ${document.documentId}...`);

      // Don't use populate here.
      // Find the request directly.
      const request = await Request.findById(document.request);

      if (!request) {
        console.log("  Request not found - skipped");
        skipped++;
        continue;
      }

      // request.student contains the Student document ID
      const student = await Student.findById(request.student);

      if (!student) {
        console.log("  Student not found - skipped");
        skipped++;
        continue;
      }

      // Student.user is the actual User ID
      const userId = student.user;

      if (!userId) {
        console.log("  Student has no user - skipped");
        skipped++;
        continue;
      }

      // Check if this PDF is already in locker
      const existing = await LockerDocument.findOne({
        studentId: userId,
        fileUrl: `/generated/${document.documentId}.pdf`
      });

      if (existing) {
        console.log("  Already in locker");
        skipped++;
        continue;
      }

      const documentType = String(
        request.documentType || "other"
      ).toLowerCase();

      // Make sure type matches LockerDocument enum
      const allowedTypes = [
        "bonafide",
        "transcript",
        "recommendation",
        "marksheet",
        "certificate",
        "other"
      ];

      const type = allowedTypes.includes(documentType)
        ? documentType
        : "other";

      await LockerDocument.create({
        studentId: userId,
        title: request.documentType || "Academic Document",
        type,
        fileUrl: `/generated/${document.documentId}.pdf`,
        issuedBy: request.reviewedBy || null,
        verified: true
      });

      console.log("  ADDED TO DIGITAL LOCKER");
      added++;
    }

    console.log("\n==============================");
    console.log("LOCKER SYNC COMPLETE");
    console.log("==============================");
    console.log(`Added:   ${added}`);
    console.log(`Skipped: ${skipped}`);

    const totalLocker = await LockerDocument.countDocuments();

    console.log(`Locker documents in database: ${totalLocker}`);

    await mongoose.disconnect();

  } catch (err) {
    console.error("\nSYNC ERROR:");
    console.error(err);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

syncLocker();