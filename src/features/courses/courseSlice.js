import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  courses: [],
  currentCourse: null,
  instructorCourses: [],
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // The backend returns an array of courses directly
      const { data } = await api.get('/courses');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchCourseBySlug = createAsyncThunk(
  'courses/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/courses/${slug}`);
      return data.data; // The course object is nested under 'data'
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// --- ADD THIS NEW FUNCTION ---
export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (courseId, { rejectWithValue }) => {
    try {


      // Let's assume you've added a `GET /courses/id/:id` route for simplicity
      const { data } = await api.get(`/courses/id/${courseId}`); // This might need adjustment based on your final backend route
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// --- END OF NEW FUNCTION ---

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/courses', courseData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchMyCourses = createAsyncThunk(
  'courses/fetchMyCourses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/courses/my-courses');
      return data.data; // Courses are under 'data' key
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (courseId, { rejectWithValue }) => {
    try {
      await api.delete(`/courses/${courseId}`);
      return courseId; // Return the ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/courses/${courseId}`, courseData);
      return data.data; // Return the updated course object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const toggleCoursePublishStatus = createAsyncThunk(
  'courses/togglePublish',
  async (courseId, { rejectWithValue }) => {
    try {
      // We don't need to send a body, the backend toggles the status
      const { data } = await api.patch(`/courses/${courseId}/publish`);
      return data.data; // The backend returns the updated course object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const toggleCourseEndedStatus = createAsyncThunk(
  'courses/toggleEnded',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/courses/${courseId}/end`);
      return data; // Return the whole response to get the message
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const recalculateCourseProgress = createAsyncThunk(
  'courses/recalculateProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/progress/recalculate/${courseId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAllCoursesAdmin = createAsyncThunk(
  'courses/fetchAllAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/courses/all');
      return data.data; // The array is in the 'data' property
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload; // API returns the array directly
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Course By Slug
      .addCase(fetchCourseBySlug.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.status = 'loading';
        state.currentCourse = null; // Clear previous course
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create Course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.instructorCourses.unshift(action.payload);
      })
      // Fetch My (Instructor) Courses
      .addCase(fetchMyCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.instructorCourses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.instructorCourses = state.instructorCourses.filter(course => course._id !== action.payload);
      })
      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.instructorCourses.findIndex(course => course._id === action.payload._id);
        if (index !== -1) {
          state.instructorCourses[index] = action.payload;
        }
        // Also update in the main courses array if it exists
        const courseIndex = state.courses.findIndex(course => course._id === action.payload._id);
        if (courseIndex !== -1) {
          state.courses[courseIndex] = action.payload;
        }
      })
      .addCase(toggleCoursePublishStatus.fulfilled, (state, action) => {
        // Find the index of the course that was updated
        const index = state.instructorCourses.findIndex(
          (course) => course._id === action.payload._id
        );
        // If the course is found in our state, replace it with the updated version
        if (index !== -1) {
          state.instructorCourses[index] = action.payload;
        }
      })
      .addCase(toggleCourseEndedStatus.fulfilled, (state, action) => {
        const index = state.instructorCourses.findIndex(c => c._id === action.payload.data._id);
        if (index !== -1) {
          state.instructorCourses[index] = action.payload.data;
        }
      })
      .addCase(fetchAllCoursesAdmin.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.instructorCourses = action.payload; // We can reuse this state array
      })
      .addCase(fetchAllCoursesAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCoursesAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;

export default courseSlice.reducer;