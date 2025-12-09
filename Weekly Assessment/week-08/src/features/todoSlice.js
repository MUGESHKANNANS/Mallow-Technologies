import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://interns-test.onrender.com/api/todos";

function normalizeTodo(item) {
  return {
    id: item._id,
    todo: item.todo,
    status: item.status,
    createdAt: item.created_at || item.createdAt,
    updatedAt: item.updated_at || item.updatedAt,
  };
}

export const fetchTodos = createAsyncThunk(
  "todos/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data.map(normalizeTodo);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to fetch todos";
      return rejectWithValue(message);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, payload);
      return normalizeTodo(res.data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create todo";
      return rejectWithValue(message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, data);
      return normalizeTodo(res.data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update todo";
      return rejectWithValue(message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete todo";
      return rejectWithValue(message);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    loading: false,
    saving: false,
    deletingId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

    .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTodo.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })


      .addCase(updateTodo.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      
      .addCase(deleteTodo.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.deletingId = null;
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      });
  },
});

export default todosSlice.reducer;
