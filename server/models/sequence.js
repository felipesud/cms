const mongoose = require("mongoose");

const sequenceScheme = mongoose.Schema({
  id: { type: String, required: true },
  maxDocumentId: { type: Number },
  maxMessageId: { type: Number },
  maxContactId: { type: Number },
});

module.exports = mongoose.model("Sequence", sequenceScheme);
