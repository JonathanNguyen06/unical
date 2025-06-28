import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addEventModalOpen: false,
  deleteModalOpen: false,
  idToDelete: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openAddEventModal: (state) => {
      state.addEventModalOpen = true;
    },
    closeAddEventModal: (state) => {
      state.addEventModalOpen = false;
    },
    openDeleteModal: (state) => {
      state.deleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.deleteModalOpen = false;
    },
    setIdToDelete: (state, action) => {
      state.idToDelete = action.payload.idToDelete;
    },
  },
});

export const {
  openAddEventModal,
  closeAddEventModal,
  openDeleteModal,
  closeDeleteModal,
  setIdToDelete,
} = modalSlice.actions;

export default modalSlice.reducer;
