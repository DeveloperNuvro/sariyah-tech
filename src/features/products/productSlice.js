import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products');
    return data.data || data; // backend returns {success, data} or array
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch products');
  }
});

export const fetchProductBySlug = createAsyncThunk('products/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/slug/${slug}`);
    return data.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload || []; })
      .addCase(fetchProducts.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(fetchProductBySlug.pending, (s) => { s.status = 'loading'; s.error = null; s.current = null; })
      .addCase(fetchProductBySlug.fulfilled, (s, a) => { s.status = 'succeeded'; s.current = a.payload; })
      .addCase(fetchProductBySlug.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; });
  }
});

export default productSlice.reducer;


