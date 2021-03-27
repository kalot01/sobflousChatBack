const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const fs = require("fs");
const path = require("path");
var User = require("../models/user");

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");

const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
  ignoreExpiration: false,
  jsonWebTokenOptions: {
    maxAge: "1d",
  },
};

passport.use(
  new JwtStrategy(options, function (jwt_payload, done) {
    const sql = `select * from users where id=${jwt_payload.sub}`;
    User.find({ _id: jwt_payload.sub })
      .exec()
      .then(function (result) {
        let user = result[0];
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        console.log(err);
        return done(err, false);
      });
  })
);

module.exports = passport;
