var express = require("express");
const passport = require("passport");
var router = express.Router();
var User = require("../models/user");
const bcrypt = require("bcrypt");
var issueJWT = require("../utils/issueJWT");
const mongoose = require("mongoose");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    User.find({ "blocked.userId": { $ne: req.user._id } }, { username: 1 })
      .exec()
      .then((result) => {
        res.json({ users: result });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
);

router.get(
  "/:pattern",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    let regx = ".*";
    for (let i = 0; i < req.params.pattern.length; i++) {
      regx += `${req.params.pattern[i]}.*`;
    }
    console.log(regx);
    User.find(
      {
        username: new RegExp(regx),
        "blocked.userId": { $ne: req.user._id },
      },
      { username: 1 }
    )
      .exec()
      .then((result) => {
        res.json({ users: result });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
);

module.exports = router;
