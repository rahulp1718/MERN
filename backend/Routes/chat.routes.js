const express = require("express");
const { protect } = require("../Middleware/auth.middleware");
const { body, param, validationResult } = require("express-validator");
const {
  USER_ID_EMPTY,
  GROUP_NAME_EMPTY,
  GROUP_ID_EMPTY,
  CHAT_ID_EMPTY,
  MIN_USER_IN_GROUP,
} = require("../utils/errorMessages");
const {
  accessChats,
  fetchAllChats,
  createGroup,
  removeChat,
  updateGroupPicture,
  updateGroupData,
} = require("../Controllers/chat.controller");
const router = express.Router();

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json({ errors: errors.array() });
  };
};

router.get("/:userId", protect, fetchAllChats);

router.post(
  "/",
  protect,
  [body("userId").notEmpty().withMessage(USER_ID_EMPTY)],
  validate([body("userId")]),
  accessChats
);

router.post(
  "/group",
  protect,
  // [
  //   body("groupName").notEmpty().withMessage(GROUP_NAME_EMPTY),
  //   body("users").isArray({ min: 3 }).withMessage(MIN_USER_IN_GROUP),
  // ],
  // validate([body("groupName"), body("users")]),
  createGroup
);

router.patch(
  "/updateGroup/:chatId",
  protect,
  // [
  //   body("groupName").notEmpty().withMessage(GROUP_NAME_EMPTY),
  //   body("users").isArray({ min: 3 }).withMessage(MIN_USER_IN_GROUP),
  // ],
  // validate([body("groupName"), body("users")]),
  updateGroupData
);

router.patch(
  "/updateGroupImage/:chatId",
  protect,
  [body("chatId").notEmpty().withMessage(GROUP_ID_EMPTY)],
  validate([body("chatId"), body("userId")]),
  updateGroupPicture
);

router.delete(
  "/removeuser/:chatId",
  protect,
  [param("chatId").notEmpty().withMessage(CHAT_ID_EMPTY)],
  validate([param("chatId")]),
  removeChat
);

module.exports = router;
