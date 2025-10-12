import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  myEnrollments: [], // For students
  courseStudents: [], // For instructors
  status: 'idle',
  error: null,
};

// --- Async Thunks ---

// STUDENT: Fetches the courses the user is successfully enrolled in (i.e., payment is 'paid').
export const fetchMyEnrollments = createAsyncThunk(
  'enrollments/fetchMyEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/enrollments/my-enrollments');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// INSTRUCTOR/ADMIN: Fetches the list of students enrolled in a specific course.
export const fetchCourseStudents = createAsyncThunk(
  'enrollments/fetchCourseStudents',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/courses/${courseId}/enrollments`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My Enrollments (Student)
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myEnrollments = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Course Students (Instructor)
      .addCase(fetchCourseStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courseStudents = action.payload;
      })
      .addCase(fetchCourseStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default enrollmentSlice.reducer;