import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "./Tabs";
import Button from "./Button";
import {
  deleteTodo,
  getAllTodos,
  toggleTodo,
  updateTodo,
} from "../Redux/actions/index";
import { ALL_TODOS, DONE_TODOS, ACTIVE_TODOS } from "../Redux/actions/types";
import { assignesList, mentorsList } from "../constant";

const Todos = () => {
  const dispatch = useDispatch();
  const [selectedAssignes, setSelectedAssignes] = useState("");
  const todos = useSelector((state) => state.todos);
  const currentTab = useSelector((state) => state.currentTab);

  useEffect(() => {
    dispatch(getAllTodos(selectedAssignes));
  }, [todos]);

  const getFilteredTodos = () => {
    if (!todos) {
      return [];
    }
    if (currentTab === ALL_TODOS) {
      return todos;
    } else if (currentTab === ACTIVE_TODOS) {
      return todos.filter((todo) => !todo.done);
    } else if (currentTab === DONE_TODOS) {
      return todos.filter((todo) => todo.done);
    }
  };

  const handleRemoveCompletedTodos = () => {
    const completedTodosIds = todos
      .filter(({ done }) => done)
      .map(({ _id }) => _id);

    for (const todoId of completedTodosIds) {
      dispatch(deleteTodo(todoId));
      dispatch(getAllTodos());
    }
  };

  const handleUpdateTodo = async (todoId, text, newAssignee) => {
    try {
      await dispatch(updateTodo(todoId, text, newAssignee));
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };

  const handleToggleTodo = (todoId) => {
    dispatch(toggleTodo(todoId));
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await dispatch(deleteTodo(todoId));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  return (
    <>
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-start gap-8 -mt-16">
        <h1 className="font-bold">Todos List</h1>
        <div className="flex items-center justify-center gap-5 -mb-5">
          <Tabs currentTab={currentTab} />
          {todos.some((todo) => todo.done) && (
            <Button
              onHandleSubmit={handleRemoveCompletedTodos}
              buttonText="Remove Done Todos"
              className="text-sm py-1 px-2 rounded font-semibold bg-red-600"
            />
          )}
        </div>
        <article className="w-full bg-white bg-opacity-95 text-black">
          <select
            name="assignees"
            id="assignees"
            value={selectedAssignes}
            onChange={(e) => setSelectedAssignes(e.target.value)}
            className="bg-blue-600 text-white text-sm p-2 m-2 rounded ml-3"
          >
            {assignesList.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <ul>
            {getFilteredTodos()?.map((todo) => (
              <li
                key={todo._id}
                className="w-full flex justify-between font-medium py-1 px-2 border-b-[1px] border-black"
                style={
                  todo.done
                    ? {
                        textDecoration: "line-through",
                        backgroundColor: "gray",
                      }
                    : { textDecoration: "none", backgroundColor: "white" }
                }
              >
                <span
                  onClick={() => dispatch(handleToggleTodo(todo._id))}
                  className="relative w-2/3 text-[16px] cursor-pointer"
                >
                  {todo.text}
                </span>
                <span className="w-1/3 text-[16px] cursor-pointer">
                  <select
                    value={todo.assignes}
                    onChange={(e) => {
                      handleUpdateTodo(todo._id, todo.text, e.target.value);
                    }}
                    className="bg-blue-500 text-white text-sm p-2 m-2 rounded ml-3"
                  >
                    {mentorsList.map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </span>
                <div className="flex items-center gap-4">
                  <span>
                    <i
                      className="fas fa-trash text-[16px] cursor-pointer"
                      onClick={() => handleDeleteTodo(todo._id)}
                    />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </>
  );
};

export default Todos;
