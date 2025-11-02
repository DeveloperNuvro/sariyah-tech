import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  current: null,
  seo: null,
  related: [],
  total: 0,
  pages: 0,
  status: 'idle',
  error: null,
};

// Fetch all published blogs
export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { q, category, tag, author, page = 1, limit = 12, sort = 'publishedAt' } = params;
    const queryParams = new URLSearchParams();
    if (q) queryParams.append('q', q);
    if (category) queryParams.append('category', category);
    if (tag) queryParams.append('tag', tag);
    if (author) queryParams.append('author', author);
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    queryParams.append('sort', sort);
    
    const { data } = await api.get(`/blogs?${queryParams.toString()}`);
    return data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch blogs');
  }
});

// Fetch blog by slug
export const fetchBlogBySlug = createAsyncThunk('blogs/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/blogs/slug/${slug}`);
    return data.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch blog');
  }
});

// Fetch blog SEO data
export const fetchBlogSEO = createAsyncThunk('blogs/fetchSEO', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/blogs/seo/${slug}`);
    return data.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch SEO data');
  }
});

// Fetch related blogs
export const fetchRelatedBlogs = createAsyncThunk('blogs/fetchRelated', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/blogs/${slug}/related`);
    return data.data || [];
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch related blogs');
  }
});

// Admin: Fetch all blogs (including unpublished)
export const adminFetchBlogs = createAsyncThunk('blogs/adminFetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { q, category, tag, author, isPublished, page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams();
    if (q) queryParams.append('q', q);
    if (category) queryParams.append('category', category);
    if (tag) queryParams.append('tag', tag);
    if (author) queryParams.append('author', author);
    if (isPublished !== undefined) queryParams.append('isPublished', isPublished);
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    const { data } = await api.get(`/blogs/admin?${queryParams.toString()}`);
    return data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch blogs');
  }
});

// Admin: Fetch blog by ID
export const adminFetchBlogById = createAsyncThunk('blogs/adminFetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/blogs/admin/${id}`);
    return data.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch blog');
  }
});

// Admin: Create blog
export const createBlog = createAsyncThunk('blogs/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/blogs', formData);
    return data.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to create blog');
  }
});

// Admin: Update blog
export const updateBlog = createAsyncThunk('blogs/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/blogs/${id}`, formData);
    return data.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to update blog');
  }
});

// Admin: Delete blog
export const deleteBlog = createAsyncThunk('blogs/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/blogs/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to delete blog');
  }
});

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.seo = null;
    },
    clearRelated: (state) => {
      state.related = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.pages = action.payload.pages || 0;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch blog by slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.current = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch SEO
      .addCase(fetchBlogSEO.fulfilled, (state, action) => {
        state.seo = action.payload;
      })
      // Fetch related
      .addCase(fetchRelatedBlogs.fulfilled, (state, action) => {
        state.related = action.payload;
      })
      // Admin fetch blogs
      .addCase(adminFetchBlogs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(adminFetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.pages = action.payload.pages || 0;
      })
      .addCase(adminFetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Admin fetch by ID
      .addCase(adminFetchBlogById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      // Create blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.items.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      // Delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.items = state.items.filter(b => b._id !== action.payload);
        if (state.current?._id === action.payload) {
          state.current = null;
        }
      });
  },
});

export const { clearCurrent, clearRelated } = blogSlice.actions;
export default blogSlice.reducer;

