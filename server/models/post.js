const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  likes: [{ type: ObjectId, ref: "USER" }],
  comments: [
    {
      text: String,
      postedBy: { type: ObjectId, ref: "USER" },
    },
  ],
  postedBy: {
    type: ObjectId,
    ref: "USER",
  },
});
mongoose.model("Post", postSchema);
