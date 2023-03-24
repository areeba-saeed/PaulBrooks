const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/medicine", {
      useNewUrlParser: true,
    });
    console.log(`Mongoose Connected ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed`, error);
  }
};

module.exports = {
  connectDB,
  secretOrKey: "1234567890",
};
