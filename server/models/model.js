const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1551712702-4b7335dd8706?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  },
  followers: [{ type: ObjectId, ref: "USER" }],
  following: [{ type: ObjectId, ref: "USER" }],
});

module.exports = mongoose.model("USER", userSchema);
