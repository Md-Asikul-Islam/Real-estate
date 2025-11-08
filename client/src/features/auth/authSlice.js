import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// 🔹 Fetch Current User from cookie
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me", { withCredentials: true });
      return data.user || data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Unauthorized");
    }
  }
);

// 🔹 Login
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/sign-in", credentials, { withCredentials: true });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// 🔹 Logout
export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/sign-out", {}, { withCredentials: true });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || "SignOut failed");
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // ✅ signIn
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // ✅ signOut
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
