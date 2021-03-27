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
    User.findOne({ _id: req.user._id })
      .exec()
      .then((result) => {
        return User.find(
          {
            _id: { $in: result.blocked.map((el) => el.userId) },
          },
          { username: 1 }
        ).exec();
      })
      .then((result) => {
        res.json({ users: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    User.updateOne(
      { _id: req.user._id },
      {
        $push: {
          blocked: {
            userId: mongoose.Types.ObjectId(req.body.id),
            timestamp: new Date(),
          },
        },
      }
    )
      .exec()
      .then((result) => {
        res.status(200).json({ message: "Utilisateur bloqué avec succes" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    User.updateOne(
      { _id: req.user._id },
      { $pull: { blocked: { userId: mongoose.Types.ObjectId(req.body.id) } } }
    )
      .exec()
      .then((result) => {
        res.status(200).json({ message: "Utilisateur débloqué avec succes" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

module.exports = router;
