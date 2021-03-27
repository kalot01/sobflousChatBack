var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const connectDB = require("./config/dbConfig");
require("dotenv").config(); 
var genKeyPair = require("./config/generateKeypair");
genKeyPair(); 
var passport = require("./config/passportConfig");

var app = express();
connectDB();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", require("./routes/index"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

module.exports = app;
