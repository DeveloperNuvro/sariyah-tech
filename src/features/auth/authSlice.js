import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Get user and token from localStorage if they exist
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  role: user ? user.role : null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/register', userData);
      // Registration now requires email verification
      // Don't set tokens or user data until email is verified
      // Just return the success message
      return { 
        message: data.message || 'Registration successful! Please check your email.',
        email: data.email 
      };
    } catch (error) {
      // Extract exact error message from backend response
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/login', credentials);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.accessToken);
      return data;
    } catch (error) {
      // Extract exact error message from backend response
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser', 
  async (_, { rejectWithValue }) => {
    try {
      // The backend will clear the httpOnly cookie.
      // We must clear localStorage on the client.
      await api.post('/users/logout');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return {};
    } catch (error) {
      // Even if logout API fails, clear client-side storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Logout failed';
      return rejectWithValue(errorMessage);
    }
});

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { getState, rejectWithValue }) => {
        // No need to load if user is already in state
        if (getState().auth.user) {
            return getState().auth.user;
        }
        try {
            const { data } = await api.get('/users/profile');
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        } catch (error) {
            // This can happen if the token is present but invalid.
            // In this case, we should clear the invalid token.
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            const errorMessage = error?.response?.data?.error || 
                                error?.response?.data?.message || 
                                error?.message || 
                                'Failed to load user';
            return rejectWithValue(errorMessage);
        }
    }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This reducer is used by the API interceptor to update the token
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Don't authenticate user until email is verified
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.role = action.payload.user.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
        state.status = 'idle';
      })
      // Load User
      .addCase(loadUser.fulfilled, (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
          state.role = action.payload.role;
          state.status = 'succeeded';
      })
      .addCase(loadUser.rejected, (state) => {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.role = null;
          state.status = 'failed';
      });
  },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;