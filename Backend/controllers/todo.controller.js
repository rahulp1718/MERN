const {
  INTERNAL_SERVER_ERROR,
  UPDATED_SUCCESSFUL,
  ERR_NOT_FOUND,
  DELETED_SUCCESSFUL,
} = require("../constant");
const Todo = require("../models/todo.model");

xports.getAllTodos = async (req, res) => {
  try {
    //  if we want to exclude some filed to not filter the todos then we can use this approach
    // const excludeFields = ["text"];
    // const queryObject = { ...req.query };
    // excludeFields.forEach((el) => {
    //   delete queryObject[el];
    // });
    // const todos = await Todo.find(queryObject);

    const todos = await Todo.find(req.query);

    res.status(200).json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.postCreateTodo = async (req, res) => {
  try {
    const { text, assignes } = req.body;
    const newTodo = await Todo.create({ text, assignes });
    return res.status(200).json(newTodo);
  } catch (error) {
    return res
      .status(500)
      .json({ message: INTERNAL_SERVER_ERROR, error: error.message });
  }
};

exports.toggleTodoDone = async (req, res) => {
  try {
    const todoRef = await Todo.findById(req.params.id);
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { done: !todoRef.done },
      { new: true }
    );
    return res.status(200).json(updatedTodo);
  } catch (error) {
    return res
      .status(500)
      .json({ message: INTERNAL_SERVER_ERROR, error: error.message });
  }
};

exports.putUpdateTodo = async (req, res) => {
  console.log("update todo data !", req.body);
  try {
    const { assignes } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { assignes },
      { new: true }
    );
    return res.json({ message: UPDATED_SUCCESSFUL, data: updatedTodo });
  } catch (error) {
    return res
      .status(404)
      .json({ message: ERR_NOT_FOUND, error: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ message: ERR_NOT_FOUND });
    }

    await Todo.findByIdAndUpdate({ _id: req.params.id }, { isDeleted: true });

    return res.json({
      message: DELETED_SUCCESSFUL,
      data: deletedTodo,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: ERR_NOT_FOUND, error: error.message });
  }
};

exports.getTodosStats = async (req, res) => {
  try {
    const data = await Todo.aggregate([
      { $match: { done: false } },
      {
        $group: {
          _id: "$assignes",
          totalTodos: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
};
