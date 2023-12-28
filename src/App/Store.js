import { configureStore } from "@reduxjs/toolkit";
import todoReducers from "../Features/Todos/TodosSlice";
const store = configureStore({
  reducer: todoReducers,
});

export default store;
