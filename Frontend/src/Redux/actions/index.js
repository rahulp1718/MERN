import axios from "axios";

import {
  ADDNEW_TODO,
  GETALL_TODO,
  UPDATE_TODO,
  DELETE_TODO,
  TOGGLE_TODO,
  TOGGLE_TAB,
} from "./types";

const API_URL = "http://localhost:8000";

export const addNewTodo = (text, assignes) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/todos`, { text, assignes });
    dispatch({ type: ADDNEW_TODO, payload: res.data });
  } catch (error) {
    console.log("Error while calling addNewTodo API ", error.message);
  }
};

export const getAllTodos = (assignes) => async (dispatch) => {
  try {
    let url = `${API_URL}/todos/`;
    if (assignes && assignes !== "All Assignees") {
      url += `?assignes=${assignes}`;
    }
    const res = await axios.get(url);
    dispatch({ type: GETALL_TODO, payload: res.data });
  } catch (error) {
    console.log("Error while calling getAllTodos API ", error.message);
  }
};

export const updateTodo = (id, text, assignes) => async (dispatch) => {
  try {
    const res = await axios.put(`${API_URL}/todos/${id}`, { assignes });
    dispatch({ type: UPDATE_TODO, payload: res.data });
  } catch (error) {
    console.log("Error while calling updateTodo API ", error.message);
  }
};

export const toggleTodo = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/todos/${id}`);
    dispatch({ type: TOGGLE_TODO, payload: res.data });
  } catch (error) {
    console.log("Error while calling toogelTodo API ", error.message);
  }
};

export const deleteTodo = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`${API_URL}/todos/${id}`);
    dispatch({ type: DELETE_TODO, payload: res.data });
  } catch (error) {
    console.log("Error while calling deleteTodo API ", error.message);
  }
};

export const toggleTab = (tab) => async (dispatch) => {
  dispatch({ type: TOGGLE_TAB, selected: tab });
};
