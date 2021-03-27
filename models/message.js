const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model("Message", messageSchema);
