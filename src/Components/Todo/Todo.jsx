import { useSelector, useDispatch } from "react-redux";
import { removeTodo, editTodo } from "../../Features/Todos/TodosSlice";

const Todo = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleEdit = (todo) => {
    dispatch(editTodo(todo));
  };
  return (
    <>
      <div className="w-[40%]">
        <h1 className="text-2xl text-white font-medium mt-10 text-center">
          Todos Lists
        </h1>
        <ul className="list-mone">
          {todos.map((todo) => {
            return (
              <li
                className="bg-blue-500 mt-3 px-3 py-1 w-full rounded flex items-center justify-between"
                key={todo.id}
              >
                <div className="text-white">{todo.text}</div>
                <div>
                  <button onClick={handleEdit} className="mr-5">
                    <i className="fa-sharp fa-solid fa-edit text-white"></i>
                  </button>
                  <button onClick={() => dispatch(removeTodo(todo.id))}>
                    <i className="fa-sharp fa-solid fa-trash text-white"></i>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Todo;
