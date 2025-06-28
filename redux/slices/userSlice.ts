import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

interface UserState {
  name: string;
  username: string;
  email: string;
  uid: string;
  events: Event[];
}

const initialState: UserState = {
  name: "",
  username: "",
  email: "",
  uid: "",
  events: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.events = action.payload.events;
    },

    signOutUser: (state) => {
      state.name = "";
      state.username = "";
      state.email = "";
      state.uid = "";
      state.events = [];
    },
  },
});

export const { signInUser, signOutUser } = userSlice.actions;

export default userSlice.reducer;
