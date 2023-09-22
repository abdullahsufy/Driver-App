import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  errormessage: "",
  errorsource: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, username, errormessage, errorsource } = action.payload;
      state._id = _id;
      state.username = username;
      state.errormessage = errormessage;
      state.errorsource = errorsource;
    },
    resetUser: (state) => {
      state._id = "";
      state.username = "";
      state.errormessage = "";
      state.errorsource = "";
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
