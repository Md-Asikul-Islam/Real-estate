import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Thunks
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/profile");
      return res.data?.user || null; // safe
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/profile", formData);
      return res.data?.user || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/change-password", passwordData);
      return res.data || { message: "Password updated successfully!" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to change password");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.delete("/users/delete");
      return res.data?.message || "Account deleted successfully!";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete account");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearUserState: (state) => {
      state.user = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get profile
      .addCase(getUserProfile.pending, (state) => { state.loading = true; })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update profile
      .addCase(updateUserProfile.pending, (state) => { state.loading = true; })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = "Profile updated successfully!";
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // change password
      .addCase(changePassword.pending, (state) => { state.loading = true; })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || "Password updated successfully!";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete account
      .addCase(deleteAccount.pending, (state) => { state.loading = true; })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.successMessage = action.payload;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
