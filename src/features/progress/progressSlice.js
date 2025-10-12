import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  // We'll store progress by courseId to avoid conflicts
  progressData: {},
  status: 'idle',
  error: null,
};

// --- Async Thunks ---
export const fetchProgressForCourse = createAsyncThunk(
  'progress/fetchForCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/progress/course/${courseId}`);
      return { courseId, progress: data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress');
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  'progress/updateLesson',
  async ({ courseId, lessonId, completed }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch('/progress/update', { courseId, lessonId, completed });
      // After updating, we can optionally re-fetch enrollments to get the new percentage
      // This is a good practice for ensuring data consistency across the app.
      // import { fetchMyEnrollments } from '../enrollments/enrollmentSlice';
      // dispatch(fetchMyEnrollments());
      return { courseId, progress: data.data.progress };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
    }
  }
);


const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgress: (state) => {
        state.progressData = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Progress
      .addCase(fetchProgressForCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProgressForCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressData[action.payload.courseId] = action.payload.progress;
      })
      .addCase(fetchProgressForCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Progress
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        state.progressData[action.payload.courseId] = action.payload.progress;
      });
  },
});

export const { clearProgress } = progressSlice.actions;
export default progressSlice.reducer;