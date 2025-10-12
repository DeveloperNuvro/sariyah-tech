import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
};

// --- Async Thunks ---
export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/categories');
      
      // --- THIS IS THE FIX ---
      // Return the array that is nested inside the 'data' property of the response.
      return data.data; 
      // --- END OF FIX ---

    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/categories', categoryData);
      return data.data; // The new category object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      return categoryId; // Return the ID for removal from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;