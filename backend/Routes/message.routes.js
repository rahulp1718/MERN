const express = require("express");
const { protect } = require("../Middleware/auth.middleware");
const {
  sendMessage,
  allMessages,
} = require("../Controllers/message.controller");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chat").get(protect, allMessages);

module.exports = router;
