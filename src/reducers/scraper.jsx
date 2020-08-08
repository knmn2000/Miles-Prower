import preset from "../preset/presets.js";
const initState = {
  template: preset,
  loading: null,
  error: null,
};

export default function (state = initState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
