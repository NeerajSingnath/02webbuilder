import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: `user`,
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateCredits: (state, action) => {
      if (state.userData && state.userData.user) {
        state.userData.user.credits = action.payload;
      }
    },
  },
});

export const { setUserData, updateCredits } = userSlice.actions;
export default userSlice.reducer;
