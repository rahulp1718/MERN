import { Route } from "react-router-dom";
import Chats from "./Pages/Chats";
import Home from "./Pages/Home";
import "./App.css";

const App = () => {
  return (
    <>
      <div className="app bg-[#031526] w-[100%] h-[100%] fixed">
        <Route path="/" component={Home} exact />
        <Route path="/chats" component={Chats} />
        <Route />
      </div>
    </>
  );
};

export default App;
