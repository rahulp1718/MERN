import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../../Features/Todos/TodosSlice";

const AddTodo = () => {
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  function handlerAddTodo(e) {
    e.preventDefault();
    dispatch(addTodo(inputValue));
    setInputValue("");
  }
  return (
    <>
      <div className="pt-5 w-[40%]">
        <h1 className="text-3xl text-white font-semibold text-center">
          Todo App
        </h1>
        <form
          action="#"
          className="mt-5 flex items-center justify-between"
          onSubmit={handlerAddTodo}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-10 rounded-md pl-3 outline-2 outline-blue-600 "
          />
          <button className="bg-blue-500 text-white p-2 rounded">
            Add Todo
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTodo;
