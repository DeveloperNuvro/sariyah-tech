import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  lastOrder: null,
  myOrders: [],
  downloads: [],
  currentOrder: null,
  adminOrders: [],
  status: 'idle',
  error: null,
};

export const checkout = createAsyncThunk('dorders/checkout', async ({ paymentMethod, transactionId, buyerInfo }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/dorders/checkout', { paymentMethod, transactionId, buyerInfo });
    return data.data || data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Checkout failed');
  }
});

export const fetchMyOrders = createAsyncThunk('dorders/my', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dorders/my');
    return data.data || [];
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch orders');
  }
});

export const fetchDownloads = createAsyncThunk('dorders/downloads', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/dorders/${orderId}/downloads`);
    return data.data || [];
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch downloads');
  }
});

export const fetchOrderById = createAsyncThunk('dorders/byId', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/dorders/${orderId}`);
    return data.data || data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch order');
  }
});

export const fetchAllDigitalOrdersAdmin = createAsyncThunk('dorders/adminAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dorders');
    return data.data || [];
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch digital orders');
  }
});

export const updateDigitalOrderStatusAdmin = createAsyncThunk('dorders/adminUpdateStatus', async ({ id, paymentStatus, transactionId }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/dorders/${id}/status`, { paymentStatus, transactionId });
    return data.data || data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to update order');
  }
});

const dorderSlice = createSlice({
  name: 'dorders',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(checkout.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(checkout.fulfilled, (s, a) => { s.status = 'succeeded'; s.lastOrder = a.payload; })
      .addCase(checkout.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.myOrders = a.payload; })
      .addCase(fetchDownloads.pending, (s) => { s.status = 'loading'; s.error = null; s.downloads = []; })
      .addCase(fetchDownloads.fulfilled, (s, a) => { s.status = 'succeeded'; s.downloads = a.payload; })
      .addCase(fetchDownloads.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; s.downloads = []; })
      .addCase(fetchOrderById.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.status = 'succeeded'; s.currentOrder = a.payload; })
      .addCase(fetchOrderById.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(fetchAllDigitalOrdersAdmin.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchAllDigitalOrdersAdmin.fulfilled, (s, a) => { s.status = 'succeeded'; s.adminOrders = a.payload; })
      .addCase(fetchAllDigitalOrdersAdmin.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(updateDigitalOrderStatusAdmin.fulfilled, (s, a) => {
        const idx = s.adminOrders.findIndex(o => o._id === a.payload._id);
        if (idx >= 0) s.adminOrders[idx] = a.payload;
        if (s.currentOrder && s.currentOrder._id === a.payload._id) s.currentOrder = a.payload;
      });
  }
});

export default dorderSlice.reducer;


