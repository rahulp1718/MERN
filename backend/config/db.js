const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const databaseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      //   useUnifiedToplogy: false,
      //   useFindAndModify: true,
    });
    console.log(
      `mongodb connected ${databaseConnection.connection.host}`.cyan.underline
    );
  } catch (error) {
    console.log(`error :, ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDb;
