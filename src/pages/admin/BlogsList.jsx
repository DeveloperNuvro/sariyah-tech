import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { adminFetchBlogs, deleteBlog } from '@/features/blogs/blogSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const BlogsList = () => {
  const dispatch = useDispatch();
  const { items, status, error, total, pages } = useSelector((s) => s.blogs);
  const [q, setQ] = useState('');
  const [onlyPublished, setOnlyPublished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      await dispatch(adminFetchBlogs({ isPublished: onlyPublished ? true : undefined })).unwrap();
    } catch (e) {
      toast.error(e || 'Failed to load blogs');
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success('Blog deleted successfully');
      load();
    } catch (e) {
      toast.error(e || 'Delete failed');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
      <section className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-64">
              <Input placeholder="Search title..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Button onClick={() => navigate('/admin/blogs/new')} className="cursor-pointer">Add Blog Post</Button>
          </div>
        </motion.div>
        <div className="md:hidden mb-4">
          <Label htmlFor="q" className="text-sm text-gray-700">Search</Label>
          <Input id="q" placeholder="Search title..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input 
              type="checkbox" 
              checked={onlyPublished} 
              onChange={(e) => {
                setOnlyPublished(e.target.checked);
                load();
              }} 
            /> 
            Show only published
          </label>
        </div>
        {status === 'loading' && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {status === 'succeeded' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items
              .filter(b => (q ? (b.title || '').toLowerCase().includes(q.toLowerCase()) : true))
              .map((blog, idx) => (
                <motion.div 
                  key={blog._id} 
                  initial={{ opacity: 0, y: 16 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                >
                  <Card className="group relative rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="p-5 pb-3 border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-4 space-y-3">
                        <div className="relative rounded-xl overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                          {blog.featuredImage ? (
                            <img src={blog.featuredImage} alt={blog.title} className="w-full h-48 object-cover" />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 font-semibold line-clamp-2">{blog.title}</div>
                          <div className="text-xs text-gray-600 line-clamp-2">{blog.excerpt || ''}</div>
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(blog.publishedAt)}</span>
                            {blog.viewCount > 0 && (
                              <span className="text-xs text-gray-500">{blog.viewCount} views</span>
                            )}
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button asChild variant="outline" className="h-8 px-3 cursor-pointer">
                              <Link to={`/admin/blogs/${blog._id}/edit`}>Edit</Link>
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => onDelete(blog._id)} 
                              className="h-8 px-3 cursor-pointer"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
        {status === 'succeeded' && items.filter(b => (q ? (b.title || '').toLowerCase().includes(q.toLowerCase()) : true)).length === 0 && (
          <div className="text-center text-gray-600 py-12">No blog posts found.</div>
        )}
      </section>
    </div>
  );
};

export default BlogsList;

