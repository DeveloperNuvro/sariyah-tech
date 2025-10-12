import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  scores: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --- Async Thunks ---
export const fetchScoresForCourse = createAsyncThunk(
  'quizScores/fetchForCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/quiz-scores/course/${courseId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchScoresForLesson = createAsyncThunk(
  'quizScores/fetchForLesson',
  async (lessonId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/quiz-scores/lesson/${lessonId}`);
      return data.data;
    } catch (error)      {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const quizScoreSlice = createSlice({
  name: 'quizScores',
  initialState,
  reducers: {
    clearScores: (state) => {
        state.scores = [];
        state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        // Match both pending actions
        (action) => action.type.startsWith('quizScores/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        // Match both fulfilled actions
        (action) => action.type.startsWith('quizScores/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.status = 'succeeded';
          state.scores = action.payload;
        }
      )
      .addMatcher(
        // Match both rejected actions
        (action) => action.type.startsWith('quizScores/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { clearScores } = quizScoreSlice.actions;
export default quizScoreSlice.reducer;