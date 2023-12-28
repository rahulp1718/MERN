const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes.js");
const chatRoutes = require("./chat.routes.js");
const messageRoutes = require("./message.routes.js");

router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/message", messageRoutes);

module.exports = router;
