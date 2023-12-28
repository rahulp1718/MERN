const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Database is connected".bgMagenta.bold);
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
