import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, username } = action.payload;
      state._id = _id;
      state.username = username;
    },
    resetUser: (state) => {
      state._id = "";
      state.username = "";
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
