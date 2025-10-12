import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  // Dashboard Stats
  dashboardStats: null,
  
  // Users
  users: [],
  usersTotal: 0,
  usersPage: 1,
  usersPages: 0,
  
  // Courses
  courses: [],
  coursesTotal: 0,
  coursesPage: 1,
  coursesPages: 0,
  
  // Lessons
  lessons: [],
  lessonsTotal: 0,
  lessonsPage: 1,
  lessonsPages: 0,
  
  // Categories
  categories: [],
  
  // Reviews
  reviews: [],
  reviewsTotal: 0,
  reviewsPage: 1,
  reviewsPages: 0,
  
  // Enrollments
  enrollments: [],
  enrollmentsTotal: 0,
  enrollmentsPage: 1,
  enrollmentsPages: 0,
  
  // Orders
  orders: [],
  ordersTotal: 0,
  ordersPage: 1,
  ordersPages: 0,
  selectedOrder: null,
  
  // Quiz Scores
  quizScores: [],
  quizScoresTotal: 0,
  quizScoresPage: 1,
  quizScoresPages: 0,
  
  status: 'idle',
  error: null,
};

// =================================================================
// DASHBOARD STATISTICS
// =================================================================
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/dashboard/stats');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

// =================================================================
// USER MANAGEMENT
// =================================================================
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/users', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      return { userId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// =================================================================
// COURSE MANAGEMENT
// =================================================================
export const getAllCoursesAdmin = createAsyncThunk(
  'admin/getAllCourses',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/courses', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const updateCourseAdmin = createAsyncThunk(
  'admin/updateCourse',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/courses/${courseId}`, courseData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const deleteCourseAdmin = createAsyncThunk(
  'admin/deleteCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/courses/${courseId}`);
      return { courseId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

// =================================================================
// LESSON MANAGEMENT
// =================================================================
export const getAllLessonsAdmin = createAsyncThunk(
  'admin/getAllLessons',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/lessons', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons');
    }
  }
);

export const updateLessonAdmin = createAsyncThunk(
  'admin/updateLesson',
  async ({ lessonId, lessonData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/lessons/${lessonId}`, lessonData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lesson');
    }
  }
);

export const deleteLessonAdmin = createAsyncThunk(
  'admin/deleteLesson',
  async (lessonId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/lessons/${lessonId}`);
      return { lessonId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lesson');
    }
  }
);

// =================================================================
// CATEGORY MANAGEMENT
// =================================================================
export const getAllCategoriesAdmin = createAsyncThunk(
  'admin/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/categories');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createCategoryAdmin = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/categories', categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategoryAdmin = createAsyncThunk(
  'admin/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/categories/${categoryId}`, categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategoryAdmin = createAsyncThunk(
  'admin/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/categories/${categoryId}`);
      return { categoryId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

// =================================================================
// REVIEW MANAGEMENT
// =================================================================
export const getAllReviewsAdmin = createAsyncThunk(
  'admin/getAllReviews',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/reviews', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const deleteReviewAdmin = createAsyncThunk(
  'admin/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/reviews/${reviewId}`);
      return { reviewId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

// =================================================================
// ENROLLMENT MANAGEMENT
// =================================================================
export const getAllEnrollmentsAdmin = createAsyncThunk(
  'admin/getAllEnrollments',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/enrollments', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  }
);

export const deleteEnrollmentAdmin = createAsyncThunk(
  'admin/deleteEnrollment',
  async (enrollmentId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/enrollments/${enrollmentId}`);
      return { enrollmentId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete enrollment');
    }
  }
);

// =================================================================
// ORDER MANAGEMENT
// =================================================================
export const getAllOrdersAdmin = createAsyncThunk(
  'admin/getAllOrders',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/orders', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const getOrderByIdAdmin = createAsyncThunk(
  'admin/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/orders/${orderId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateOrderAdmin = createAsyncThunk(
  'admin/updateOrder',
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/orders/${orderId}`, orderData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order');
    }
  }
);

export const deleteOrderAdmin = createAsyncThunk(
  'admin/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete order');
    }
  }
);

// =================================================================
// QUIZ SCORES MANAGEMENT
// =================================================================
export const getAllQuizScoresAdmin = createAsyncThunk(
  'admin/getAllQuizScores',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/quiz-scores', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz scores');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAdminState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Users
      .addCase(getAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.data;
        state.usersTotal = action.payload.total;
        state.usersPage = action.payload.page;
        state.usersPages = action.payload.pages;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload.data._id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload.userId);
        state.usersTotal -= 1;
      })

      // Courses
      .addCase(getAllCoursesAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllCoursesAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload.data;
        state.coursesTotal = action.payload.total;
        state.coursesPage = action.payload.page;
        state.coursesPages = action.payload.pages;
      })
      .addCase(getAllCoursesAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCourseAdmin.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course._id === action.payload.data._id);
        if (index !== -1) {
          state.courses[index] = action.payload.data;
        }
      })
      .addCase(deleteCourseAdmin.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course._id !== action.payload.courseId);
        state.coursesTotal -= 1;
      })

      // Lessons
      .addCase(getAllLessonsAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllLessonsAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lessons = action.payload.data;
        state.lessonsTotal = action.payload.total;
        state.lessonsPage = action.payload.page;
        state.lessonsPages = action.payload.pages;
      })
      .addCase(getAllLessonsAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateLessonAdmin.fulfilled, (state, action) => {
        const index = state.lessons.findIndex(lesson => lesson._id === action.payload.data._id);
        if (index !== -1) {
          state.lessons[index] = action.payload.data;
        }
      })
      .addCase(deleteLessonAdmin.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(lesson => lesson._id !== action.payload.lessonId);
        state.lessonsTotal -= 1;
      })

      // Categories
      .addCase(getAllCategoriesAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllCategoriesAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload.data;
      })
      .addCase(getAllCategoriesAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createCategoryAdmin.fulfilled, (state, action) => {
        state.categories.unshift(action.payload.data);
      })
      .addCase(updateCategoryAdmin.fulfilled, (state, action) => {
        const index = state.categories.findIndex(category => category._id === action.payload.data._id);
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
      })
      .addCase(deleteCategoryAdmin.fulfilled, (state, action) => {
        state.categories = state.categories.filter(category => category._id !== action.payload.categoryId);
      })

      // Reviews
      .addCase(getAllReviewsAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllReviewsAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload.data;
        state.reviewsTotal = action.payload.total;
        state.reviewsPage = action.payload.page;
        state.reviewsPages = action.payload.pages;
      })
      .addCase(getAllReviewsAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteReviewAdmin.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review._id !== action.payload.reviewId);
        state.reviewsTotal -= 1;
      })

      // Enrollments
      .addCase(getAllEnrollmentsAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllEnrollmentsAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.enrollments = action.payload.data;
        state.enrollmentsTotal = action.payload.total;
        state.enrollmentsPage = action.payload.page;
        state.enrollmentsPages = action.payload.pages;
      })
      .addCase(getAllEnrollmentsAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteEnrollmentAdmin.fulfilled, (state, action) => {
        state.enrollments = state.enrollments.filter(enrollment => enrollment._id !== action.payload.enrollmentId);
        state.enrollmentsTotal -= 1;
      })

      // Orders
      .addCase(getAllOrdersAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllOrdersAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.data;
        state.ordersTotal = action.payload.total;
        state.ordersPage = action.payload.page;
        state.ordersPages = action.payload.pages;
      })
      .addCase(getAllOrdersAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getOrderByIdAdmin.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
      .addCase(updateOrderAdmin.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteOrderAdmin.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload);
        state.ordersTotal -= 1;
      })

      // Quiz Scores
      .addCase(getAllQuizScoresAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllQuizScoresAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizScores = action.payload.data;
        state.quizScoresTotal = action.payload.total;
        state.quizScoresPage = action.payload.page;
        state.quizScoresPages = action.payload.pages;
      })
      .addCase(getAllQuizScoresAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
