var express = require("express");
const passport = require("passport");
var router = express.Router();
var User = require("../models/user");
const bcrypt = require("bcrypt");
var issueJWT = require("../utils/issueJWT");
const mongoose = require("mongoose");

/* GET home page. */
router.post("/register", function (req, res, next) {
  User.find({ username: req.body.username })
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.json({
          error: "le nom de compte existe déja",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              friends: [],
              blocked: [],
              requests: [],
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "Inscription Réussie",
                });
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/login", function (req, res, next) {
  User.find({ username: req.body.username })
    .exec()
    .then((result) => {
      if (result[0]) {
        bcrypt.compare(
          req.body.password,
          result[0].password,
          function (err, compRes) {
            if (err) {
              res.json({ error: err });
            } else {
              if (compRes) {
                res.status(201).json({
                  ...issueJWT(result[0]),
                  username: req.body.username,
                  _id: result[0]._id,
                });
              } else {
                res.json({ error: "Nom de compte ou mot de passe incorrete" });
              }
            }
          }
        );
      } else {
        res.json({ error: "Nom de compte ou mot de passe incorrete" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
});

router.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.json({ auth: true });
  }
);

module.exports = router;
