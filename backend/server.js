require('dotenv').config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");


const app = express();
app.use(cookieParser()); // Use cookie-parser middleware
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://traveai.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'] 
}));

app.use(express.json());


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