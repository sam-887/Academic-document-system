require("dotenv").config();

const mongoose = require("mongoose");
const LockerDocument = require("../models/LockerDocument");

async function clean() {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await LockerDocument.deleteMany({
    fileUrl: { $regex: "^/generated/" }
  });

  console.log("Deleted generated locker documents:", result.deletedCount);

  const remaining = await LockerDocument.countDocuments();

  console.log("Remaining locker documents:", remaining);

  await mongoose.disconnect();
}

clean().catch((err) => {
  console.error(err);
  process.exit(1);
});


