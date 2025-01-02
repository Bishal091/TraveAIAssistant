const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected route for AI chat
router.post("/chat", authMiddleware, aiController.chat);

module.exports = router;