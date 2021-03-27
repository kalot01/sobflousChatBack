const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("MongDB Connected :D");
    })
    .catch((err) => {
      console.log(err.mesage);
      // Close server with failure.
      process.exit(1);
    });
};

module.exports = connectDB;
