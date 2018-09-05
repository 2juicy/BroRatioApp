const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRecordSchema = new Schema({
  username: { type: String },
  password: { type: String },
  date: { type: Date, default: Date.now },
  userMetas: {
    type: Schema.Types.ObjectId,
    ref: "userMeta"
  },
  profileImages: []
});

const UserRecord = mongoose.model("userRecord", userRecordSchema);

module.exports = UserRecord;
