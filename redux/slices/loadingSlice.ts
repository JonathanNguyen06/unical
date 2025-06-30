import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingScreenOpen: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    closeLoadingScreen: (state) => {
      state.loadingScreenOpen = false;
    },
    openLoadingScreen: (state) => {
      state.loadingScreenOpen = true;
    },
  },
});

export const { closeLoadingScreen, openLoadingScreen } = loadingSlice.actions;

export default loadingSlice.reducer;
