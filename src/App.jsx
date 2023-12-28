import AddTodo from "./Components/Todo/AddTodo";
import Todo from "./Components/Todo/Todo";

const App = () => {
  return (
    <>
      <div className="bg-black w-full h-screen bg-opacity-90 flex flex-col items-center">
        <AddTodo />
        <Todo />
      </div>
    </>
  );
};

export default App;
