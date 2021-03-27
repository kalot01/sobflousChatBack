const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  picture: { type: String, required: false },
  friends: { type: [mongoose.Schema.Types.Mixed], required: true },
  blocked: { type: [mongoose.Schema.Types.Mixed], required: true },
  requests: { type: [mongoose.Schema.Types.Mixed], required: true },
  sentRequests: { type: [mongoose.Schema.Types.Mixed], required: true },
});

module.exports = mongoose.model("User", userSchema);
