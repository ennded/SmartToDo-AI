import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "/api/todos";

// Async thunks
export const getTodos = createAsyncThunk(
  "todos/getTodos",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL, todoData, config);
      toast.success("Todo created successfully");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, todoData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${API_URL}/${id}`, todoData, config);
      toast.success("Todo updated successfully");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/${id}`, config);
      toast.success("Todo deleted successfully");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  todos: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    reorderTodos: (state, action) => {
      const { startIndex, endIndex } = action.payload;
      const newTodos = [...state.todos];
      const [removed] = newTodos.splice(startIndex, 1);
      newTodos.splice(endIndex, 0, removed);
      state.todos = newTodos;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos.push(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, reorderTodos } = todoSlice.actions;
export default todoSlice.reducer;
