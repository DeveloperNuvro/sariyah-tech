import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  certificates: [],
  status: 'idle',
};

export const fetchMyCertificates = createAsyncThunk(
  'certificates/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/certificates/my-certificates');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const certificateSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCertificates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyCertificates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.certificates = action.payload;
      })
      .addCase(fetchMyCertificates.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default certificateSlice.reducer;