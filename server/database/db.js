const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const databaseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
    });
    console.log(`mongodb connected ${databaseConnection.connection.host}`);
  } catch (error) {
    console.log(`error :, ${error.message}`);
    process.exit();
  }
};

module.exports = connectDb;
