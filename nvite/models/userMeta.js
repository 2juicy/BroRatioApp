//Using Mongose
const Mongoose = require("mongoose");

//Schema Class gets imported
const Schema = Mongoose.Schema;

const userMetaIn = new Schema({
  img1: { type: String },
  img2: { type: String },
  img3: { type: String },
  img4: { type: String },
  img5: { type: String },
  imgHistory: { type: Array }
});

const UserMeta = Mongoose.model("userMeta", userMetaIn);

module.exports = UserMeta;
