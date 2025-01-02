require('dotenv').config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");


const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});