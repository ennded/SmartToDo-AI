import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "/api/ai";

// Async thunks
export const suggestTasks = createAsyncThunk(
  "ai/suggestTasks",
  async (input, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/suggest-tasks`,
        { input },
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getWeeklySummary = createAsyncThunk(
  "ai/getWeeklySummary",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/weekly-summary`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskChat = createAsyncThunk(
  "ai/taskChat",
  async ({ question }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/chat`,
        { question },
        config
      );
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
  suggestedTasks: [],
  weeklySummary: "",
  chatAnswer: "",
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.suggestedTasks = [];
      state.chatAnswer = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(suggestTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(suggestTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.suggestedTasks = action.payload;
      })
      .addCase(suggestTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getWeeklySummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWeeklySummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.weeklySummary = action.payload.summary;
      })
      .addCase(getWeeklySummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(taskChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(taskChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.chatAnswer = action.payload.answer;
      })
      .addCase(taskChat.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = aiSlice.actions;
export default aiSlice.reducer;
