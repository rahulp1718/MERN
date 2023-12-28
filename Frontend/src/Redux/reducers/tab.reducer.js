import * as actionTypes from "../actions/types";

export const tabReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_TAB:
      return action.selected;
    default:
      return state;
  }
};
