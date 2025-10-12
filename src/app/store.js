import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseSlice';
import orderReducer from '../features/orders/orderSlice';
import enrollmentReducer from '../features/enrollments/enrollmentSlice';
import lessonReducer from '../features/lessons/lessonSlice';
import progressReducer from '../features/progress/progressSlice';
import quizReducer from '../features/quiz/quizSlice';
import quizScoreReducer from '../features/quizScores/quizScoreSlice';
import certificateReducer from '../features/certificates/certificateSlice'
import categoryReducer from '../features/categories/categorySlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    orders: orderReducer,
    enrollments: enrollmentReducer,
    lessons: lessonReducer,
    progress: progressReducer,
    quizzes: quizReducer,
    quizScores: quizScoreReducer,
    certificates: certificateReducer,
    categories: categoryReducer,
  },
  // Adding middleware is good practice for production, but not strictly needed for this setup to work
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production', // Enable devtools only in development
});