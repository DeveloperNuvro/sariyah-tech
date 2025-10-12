import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  myOrders: [],
  allOrders: [], // For admin use
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --- Async Thunks ---

// STUDENT: Creates a new order after filling out the checkout form.
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      // Check if orderData is FormData (for file uploads)
      const isFormData = orderData instanceof FormData;
      
      const config = {
        headers: isFormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        }
      };
      
      const { data } = await api.post('/orders', orderData, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not create order.');
    }
  }
);

// STUDENT: Fetches all orders placed by the currently logged-in user.
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/my-orders');
      return data.data; // The backend wraps the array in a 'data' object
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not fetch your orders.');
    }
  }
);

// ADMIN: Fetches all orders from all users.
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not fetch all orders.');
    }
  }
);

// ADMIN: Updates the payment status of an order (e.g., from 'pending' to 'paid').
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, paymentStatus, transactionId }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { paymentStatus, transactionId });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not update order status.');
    }
  }
);


const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add the new order to the list of myOrders
        state.myOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Order Status (Admin)
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Find the index of the updated order in the allOrders array
        const index = state.allOrders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          // Replace the old order with the updated one
          state.allOrders[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;