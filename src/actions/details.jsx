import {
  EDIT_NAME,
  EDIT_REG_FULL,
  EDIT_REG,
  EDIT_COUNTRY,
  EDIT_URL,
  EDIT_CLASS,
  EDIT_TEMPLATE,
} from "./types";

export const editTemplate = (value) => (dispatch) => {
  try {
    dispatch({
      type: EDIT_TEMPLATE,
      payload: value,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "ERROR",
      payload: err,
    });
  }
};
export const editName = (value) => (dispatch) => {
  try {
    dispatch({
      type: EDIT_NAME,
      payload: value,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "ERROR",
      payload: err,
    });
  }
};
export const editRegulator = (value) => (dispatch) => {
  try {
    dispatch({
      type: EDIT_REG,
      payload: value,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "ERROR",
      payload: err,
    });
  }
};
export const editRegFull = (value) => (dispatch) => {
  try {
    dispatch({
      type: EDIT_REG_FULL,
      payload: value,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "ERROR",
      payload: err,
    });
  }
};
export const editUrl = (value) => (dispatch) => {
  try {
    dispatch({
      type: EDIT_URL,
      payload: value,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "ERROR",
      payload: err,
    });
  }
};
export const editClass = (value) => (dispatch) => {
  try {
    dispatch({
      type: EDIT_CLASS,
      payload: value,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "ERROR",
      payload: err,
    });
  }
};
export const editCountry = (value) => (dispatch) => {
  try {
    dispatch({
      type: EDIT_COUNTRY,
      payload: value,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "ERROR",
      payload: err,
    });
  }
};
