import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  quizzes: {}, // To store quiz data { lessonId: quiz }
  currentQuiz: null, // For the quiz being taken
  currentQuizResult: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --- Async Thunks ---

export const createQuizForLesson = createAsyncThunk(
  'quizzes/create',
  async ({ lessonId, quizData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/lessons/${lessonId}/quiz`, quizData);
      return { lessonId, quiz: data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- NEW THUNK: Fetch quiz for a student ---
export const fetchQuizForLesson = createAsyncThunk(
  'quizzes/fetchForLesson',
  async (lessonId, { rejectWithValue }) => {
    try {
      // This endpoint returns the quiz questions WITHOUT the correct answers
      const { data } = await api.get(`/lessons/${lessonId}/quiz`);
      return data.data;
    } catch (error) {
      // It's okay if a quiz is not found (404), so we handle that gracefully
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- NEW THUNK: Submit student's answers ---
export const submitQuizAnswers = createAsyncThunk(
  'quizzes/submit',
  async ({ lessonId, answers }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/lessons/${lessonId}/quiz/submit`, { answers });
      return data.data; // This will be the results object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- NEW THUNK: Fetch existing quiz result for a student ---
export const fetchQuizResult = createAsyncThunk(
  'quizzes/fetchResult',
  async (lessonId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/lessons/${lessonId}/quiz/result`);
      return data.data; // This will be the existing result object
    } catch (error) {
      // It's okay if no result is found (404), student hasn't taken the quiz yet
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearCurrentQuiz: (state) => {
        state.currentQuiz = null;
        state.currentQuizResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ... existing createQuizForLesson cases ...

      // Fetch Quiz
      .addCase(fetchQuizForLesson.pending, (state) => {
        state.status = 'loading';
        state.currentQuiz = null;
        state.currentQuizResult = null;
      })
      .addCase(fetchQuizForLesson.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizForLesson.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Submit Quiz
      .addCase(submitQuizAnswers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuizResult = action.payload;
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Quiz Result
      .addCase(fetchQuizResult.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizResult.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuizResult = action.payload;
      })
      .addCase(fetchQuizResult.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentQuiz } = quizSlice.actions;
export default quizSlice.reducer;