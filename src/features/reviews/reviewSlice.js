import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  reviews: [],
  canReview: false,
  reviewReason: '',
  status: 'idle',
  error: null,
};

// =================================================================
// REVIEW MANAGEMENT
// =================================================================

export const getReviewsForCourse = createAsyncThunk(
  'reviews/getReviewsForCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/courses/${courseId}/reviews`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const canReviewCourse = createAsyncThunk(
  'reviews/canReviewCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/courses/${courseId}/reviews/can-review`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check review eligibility');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ courseId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/courses/${courseId}/reviews`, reviewData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/reviews/${reviewId}`, reviewData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetReviewState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Reviews for Course
      .addCase(getReviewsForCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getReviewsForCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(getReviewsForCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Can Review Course
      .addCase(canReviewCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(canReviewCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.canReview = action.payload.canReview;
        state.reviewReason = action.payload.reason;
      })
      .addCase(canReviewCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create Review
      .addCase(createReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews.unshift(action.payload);
        state.canReview = false;
        state.reviewReason = 'You have already submitted a review for this course';
      })
      .addCase(createReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })

      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
        state.canReview = true;
        state.reviewReason = 'You can review this course';
      });
  }
});

export const { clearError, resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
