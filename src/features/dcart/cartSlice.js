import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  subtotal: 0,
  status: 'idle',
  error: null,
};

export const fetchCart = createAsyncThunk('dcart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    const payload = data.data || data;
    return { items: payload.items || [], subtotal: payload.subtotal || 0 };
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('dcart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart/add', { productId, quantity });
    const payload = data.data || data;
    return { items: payload.items || [], subtotal: payload.subtotal || 0 };
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to add to cart');
  }
});

export const updateItem = createAsyncThunk('dcart/update', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch('/cart/update', { productId, quantity });
    const payload = data.data || data;
    return { items: payload.items || [], subtotal: payload.subtotal || 0 };
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to update cart');
  }
});

export const removeItem = createAsyncThunk('dcart/remove', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    const payload = data.data || data;
    return { items: payload.items || [], subtotal: payload.subtotal || 0 };
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to remove item');
  }
});

export const clearCart = createAsyncThunk('dcart/clear', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.delete('/cart/clear');
    const payload = data.data || data;
    return { items: payload.items || [], subtotal: payload.subtotal || 0 };
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'dcart',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchCart.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchCart.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload.items; s.subtotal = a.payload.subtotal; })
      .addCase(fetchCart.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(addToCart.fulfilled, (s, a) => { s.items = a.payload.items; s.subtotal = a.payload.subtotal; })
      .addCase(updateItem.fulfilled, (s, a) => { s.items = a.payload.items; s.subtotal = a.payload.subtotal; })
      .addCase(removeItem.fulfilled, (s, a) => { s.items = a.payload.items; s.subtotal = a.payload.subtotal; })
      .addCase(clearCart.fulfilled, (s, a) => { s.items = a.payload.items; s.subtotal = a.payload.subtotal; });
  }
});

export default cartSlice.reducer;


