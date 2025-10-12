import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  lessons: [],
  status: 'idle',
  error: null,
};

// --- Async Thunks ---

// STUDENT/INSTRUCTOR/ADMIN: Fetches all lessons for a given course.
export const fetchLessonsForCourse = createAsyncThunk(
  'lessons/fetchForCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/courses/${courseId}/lessons`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// INSTRUCTOR/ADMIN: Adds a new lesson to a course.
export const addLessonToCourse = createAsyncThunk(
  'lessons/add',
  async ({ courseId, lessonData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/courses/${courseId}/lessons`, lessonData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    // A regular reducer to clear lessons when a user navigates away from a course.
    // This prevents showing old lessons on a new course page before new data loads.
    clearLessons: (state) => {
      state.lessons = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lessons
      .addCase(fetchLessonsForCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLessonsForCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsForCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Lesson
      .addCase(addLessonToCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addLessonToCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lessons.push(action.payload); // Add the new lesson to the list
      })
      .addCase(addLessonToCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearLessons } = lessonSlice.actions;

export default lessonSlice.reducer;