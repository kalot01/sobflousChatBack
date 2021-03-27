var express = require('express');
var router = express.Router();

/* GET home page. */
router.use("/auth", require("./auth.js"));
router.use("/users", require("./users.js"));
router.use("/friends", require("./friends.js"));
router.use("/blacklist", require("./blacklist.js"));
router.use("/messages", require("./messages.js"));

module.exports = router;
