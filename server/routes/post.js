const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const requireLogin = require("../Middlewares/requireLogin");
const Post = mongoose.model("Post");

//Router

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

// if postedby in following
router.get("/getsubpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, photo } = req.body;

  if (!title || !body || !photo) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  // console.log(req.user);
  // res.send("ok");
  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.put("/comment", requireLogin, async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name");
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(updatedPost);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

// logic for delete posts
router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id"
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Check if the logged-in user is the owner of the post
    if (post.postedBy._id.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }
    // Proceed with deletion
    await Post.deleteOne({ _id: req.params.postId });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
