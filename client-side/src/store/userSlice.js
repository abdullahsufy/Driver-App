import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  errormessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, username, errormessage } = action.payload;
      state._id = _id;
      state.username = username;
      state.errormessage = errormessage;
    },
    resetUser: (state) => {
      state._id = "";
      state.username = "";
      state.errormessage = "";
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
