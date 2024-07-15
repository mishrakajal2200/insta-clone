require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Import models
require("./models/model.js");
require("./models/post.js");

// Middleware
app.use(
  cors({
    origin: "https://inquisitive-platypus-31fca4.netlify.app/",
  })
);

app.use(express.json());

// Routes
app.use(require("./routes/auth.js"));
app.use(require("./routes/post.js"));
app.use(require("./routes/user.js"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

const PORT = process.env.PORT || 6000;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
