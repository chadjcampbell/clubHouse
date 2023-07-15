const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createMessage,
  getMessages,
  deleteMessage,
  updateMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/", protect, createMessage);
router.get("/", protect, getMessages);
router.delete("/:id", protect, deleteMessage);
router.patch("/:id", protect, updateMessage);

module.exports = router;
