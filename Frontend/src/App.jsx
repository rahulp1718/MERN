import { useState } from "react";
import "./App.css";
import Button from "./components/Button";
import InputBox from "./components/InputBox";
import Header from "./components/Header";
import { addNewTodo } from "./Redux/actions";
import { useDispatch } from "react-redux";
import Todos from "./components/Todos";
import { mentorsList } from "./constant";

const App = () => {
  const [text, setText] = useState("");
  const [assignes, setAssignes] = useState("select assignes");
  const todoData = [];

  const dispatch = useDispatch();
  const onHandleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewTodo(text, assignes));
    const data = {
      text: text,
      assignes: assignes,
    };
    todoData.push(data);
    setText("");
    setAssignes("select assignes");
  };

  return (
    <>
      <div className="bg-gray-900 w-full min-h-screen text-white text-3xl flex flex-col items-center gap-20 px-5 md:px-0 lg:px-0 py-10">
        <Header />
        <div className=" w-full md:w-1/2 lg:w-1/3 flex justify-center gap-2">
          <InputBox
            type="text"
            onHandleChange={(e) => setText(e.target.value)}
            inputValue={text}
            className="w-full text-black outline-blue-600 outline-[2px]"
            placeholder="Enter new todo text..."
          />
          <select
            name="assignes"
            id="assignes"
            onChange={(e) => setAssignes(e.target.value)}
            defaultValue={"select assignes"}
            className="bg-white text-blue-600 text-sm"
          >
            <option value="select assignes">select assignes</option>
            {mentorsList.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <Button
            onHandleSubmit={onHandleSubmit}
            buttonText="Submit"
            className="py-1 px-2 text-base"
          />
        </div>
        <Todos />
      </div>
    </>
  );
};

export default App;
