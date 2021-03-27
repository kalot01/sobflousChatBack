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
    User.find(
      {
        "friends.userId": req.user._id,
        "blocked.userId": { $ne: req.user._id },
      },
      { username: 1 }
    )
      .exec()
      .then((result) => {
        res.json({ friends: result });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
);

router.get(
  "/requests",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    User.findOne({
      _id: req.user._id,
    })
      .exec()
      .then((result) => {
        const Users = result.requests.map((el) => el.userId);
        const blocked = result.blocked.map((el) => el.userId);
        return User.find(
          {
            _id: {
              $in: Users,
              $nin: blocked,
            },
          },
          "username"
        ).exec();
      })
      .then((result) => {
        res.status(200).json({ requests: result });
      })
      .catch((err) => {
        res.json({ error: err });
      });
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    User.findOne({ _id: mongoose.Types.ObjectId(req.body.id) })
      .exec()
      .then((result) => {
        if (result.blocked.map((el) => el.userId).includes(req.user._id)) {
          res.status(403).json({ message: "L'utilisateur vous a bloqué" });
        } else {
          User.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.id) },
            {
              $push: {
                requests: { userId: req.user._id, timestamp: new Date() },
              },
            }
          )
            .exec()
            .then((result) => {
              return User.updateOne(
                { _id: req.user._id },
                {
                  $push: {
                    sentRequests: {
                      userId: mongoose.Types.ObjectId(req.body.id),
                      timestamp: new Date(),
                    },
                  },
                }
              ).exec();
            })
            .then((result) => {
              res
                .status(200)
                .json({ message: "Invitation envoyée avec Succes" });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    User.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.id) },
      { $pull: { sentRequests: { userId: req.user._id } } }
    )
      .exec()
      .then((result) => {
        return User.updateOne(
          { _id: req.user._id },
          {
            $pull: {
              requests: { userId: mongoose.Types.ObjectId(req.body.id) },
            },
          }
        ).exec();
      })
      .then((result) => {
        if (req.body.accepted) {
          return User.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.id) },
            {
              $push: {
                friends: { userId: req.user._id, timestamp: new Date() },
              },
            }
          ).exec();
        }
      })
      .then((result) => {
        if (req.body.accepted) {
          return User.updateOne(
            { _id: req.user._id },
            {
              $push: {
                friends: {
                  userId: mongoose.Types.ObjectId(req.body.id),
                  timestamp: new Date(),
                },
              },
            }
          ).exec();
        }
      })
      .then((result) => {
        res.status(200).json({
          message: req.body.accepted
            ? "Invitation acceptée"
            : "Invitation refusée",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    User.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.id) },
      { $pull: { friends: { userId: req.user._id } } }
    )
      .exec()
      .then((result) => {
        return User.updateOne(
          { _id: req.user._id },
          {
            $pull: {
              friends: { userId: mongoose.Types.ObjectId(req.body.id) },
            },
          }
        ).exec();
      })
      .then((result) => {
        res.status(200).json({ message: "Vous avez retiré l'ami avec succes" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  }
);

module.exports = router;
