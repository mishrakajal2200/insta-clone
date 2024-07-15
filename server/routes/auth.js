const express = require("express");
const USER = require("../models/model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requireLogin = require("../Middlewares/requireLogin");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
// const { JWT_SECRET } = require("../.env");
router.get("/protect", requireLogin, (req, res) => {
  console.log("hello users");
});

router.post("/signup", (req, res) => {
  console.log("Received data:", req.body);

  const { email, name, password, photo } = req.body;
  console.log(email, name, password, photo);

  if (!email || !name || !password) {
    res.status(422).json({ error: "please add all the the fields" });
  }

  USER.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "user already exist with that email" });
    }

    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new USER({
        name: name,
        email: email,
        password: hashedPassword,
        photo: photo,
      });
      user
        .save()
        .then((user) => res.json({ message: "saved successfully" }))
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email and password" });
  }
  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          // return res.status(200).json({message:"signed in successfully"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, {
            expiresIn: "1h",
          });
          const { _id, name, email, followers, following, photo } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, photo },
          });
          // localStorage.setItem("jwt", token);
          // console.log("Token stored:", token);
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = router;
