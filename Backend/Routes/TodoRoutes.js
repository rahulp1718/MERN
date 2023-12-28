const express = require("express");
const { body, validationResult, check } = require("express-validator");
const route = express.Router();

const {
  getAllTodos,
  postCreateTodo,
  putUpdateTodo,
  deleteTodo,
  toggleTodoDone,
  getTodosStats,
} = require("../controllers/todo.controller.js");
const {
  ERR_NOT_FOUND,
  INVALID_TEXT_VALUE,
  SELECT_MENTOR,
} = require("../constant.js");

const validate = (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    return res.send(` ${data.text}!`);
  }
  res.send({ errors: result.array() });
};

route.get("/todos", getAllTodos);
route.get("/todos/todo-stats", getTodosStats);

route.post(
  "/todos",
  [
    body("text").isLength({ min: 2 }).withMessage(INVALID_TEXT_VALUE),
    check("assignes").notEmpty().withMessage(SELECT_MENTOR),
  ],
  validate,
  postCreateTodo
);

route.get(
  "/todos/:id",
  [body("_id").isMongoId().withMessage(ERR_NOT_FOUND)],
  validate,
  toggleTodoDone
);

route.patch(
  "/todos/:id",
  [
    body("_id").isMongoId().withMessage(ERR_NOT_FOUND),
    body("assignes").notEmpty().withMessage(SELECT_MENTOR),
  ],
  validate,
  putUpdateTodo
);

route.delete(
  "/todos/:id",
  [body("_id").isMongoId().withMessage(ERR_NOT_FOUND)],
  validate,
  deleteTodo
);

module.exports = route;
