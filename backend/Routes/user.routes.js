const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../Middleware/auth.middleware");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Controllers/user.controller");
const {
  NAME_EMPTY,
  INVALID_EMAIL,
  PASSWORD_LENGTH,
} = require("../utils/errorMessages");
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

router
  .route("/")
  .post(
    // [
    //   body("name").trim().notEmpty().withMessage(NAME_EMPTY),
    //   body("email").isEmail().withMessage(INVALID_EMAIL),
    //   body("password").trim().isLength({ min: 6 }).withMessage(PASSWORD_LENGTH),
    // ],
    // validate,
    registerUser
  )
  .get(protect, allUsers);

router.post(
  "/login",
  // [
  //   body("email").isEmail().withMessage(INVALID_EMAIL),
  //   body("password").trim().isLength({ min: 6 }).withMessage(PASSWORD_LENGTH),
  // ],
  // validate,
  authUser
);

module.exports = router;
