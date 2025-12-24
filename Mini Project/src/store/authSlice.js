import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },

    signupSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },



    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    restoreSession: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    

    updateUser: (state, action) => {
      state.user = action.payload?.user ? action.payload.user : action.payload;
    },

    fetchUserRequest: (state) => { },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("auth");
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  clearAuthError,
  restoreSession,
  updateUser,
  fetchUserRequest,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
