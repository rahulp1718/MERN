import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { todosReducers } from "./reducers/todos.reducer.js";
import thunk from "redux-thunk";
import { tabReducer } from "./reducers/tab.reducer.js";

const reducer = combineReducers({
  todos: todosReducers,
  currentTab: tabReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
