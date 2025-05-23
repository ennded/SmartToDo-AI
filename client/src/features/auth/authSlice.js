import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import api from "../../api/client";

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/auth/register", userData);
      // Add the same structure here
      if (response.data?.token) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: response.data.token,
            ...response.data,
          })
        );
      }
    } catch (error) {
      // Enhanced error handling
      let message = error.response?.data?.message || error.message;
      if (!message && error.response?.status === 404) {
        message = "API endpoint not found - check network configuration";
      }
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", userData);
      if (response.data?.token) {
        localStorage.setItem(
          "user",
          JSON.stringify({ token: response.data.token, ...response.data })
        );
      }
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      toast.success("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
