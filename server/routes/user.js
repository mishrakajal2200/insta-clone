const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../Middlewares/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("USER");

router.get(`/user/:id`, requireLogin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name")
      .exec();
    res.json({ user, posts });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
});

router.put("/follow", requireLogin, async (req, res) => {
  try {
    // Update the user being followed (req.user.followId)
    const followedUser = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true } // To return the updated document
    );

    // Update the current user (req.user.id)
    const currentUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true } // To return the updated document
    );

    res.json({ followedUser, currentUser }); // Respond with the updated user object
  } catch (err) {
    console.error("Error following user:", err);
    return res.status(422).json({ error: err.message });
  }
});

router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    // Update the user being followed (req.user.followId)
    const unfollowUser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.user._id } },
      { new: true } // To return the updated document
    );

    // Update the current user (req.user.id)
    const currentUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.unfollowId } },
      { new: true } // To return the updated document
    );

    res.json({ unfollowUser, currentUser }); // Respond with the updated user object
  } catch (err) {
    console.error("Error following user:", err);
    return res.status(422).json({ error: err.message });
  }
});

router.put("/updatephoto", async (req, res) => {
  const { userId, photo } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photo: photo },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile photo updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

module.exports = router;
