import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchBlogs } from '@/features/blogs/blogSlice';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { generateSEOMeta } from '@/utils/seo';

const Blogs = () => {
  const dispatch = useDispatch();
  const { items, status, error, total, pages } = useSelector((s) => s.blogs);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';

  useEffect(() => {
    dispatch(fetchBlogs({ 
      page, 
      q, 
      category, 
      tag,
      limit: 12 
    }));
  }, [dispatch, page, q, category, tag]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }, []);

  const seoData = useMemo(() => generateSEOMeta({
    title: 'Blog',
    description: 'Read the latest tech articles, tutorials, and insights from Sariyah Tech. Learn web development, mobile apps, AI, and more.',
    keywords: ['tech blog', 'programming tutorials', 'web development blog', 'tech articles', 'coding tips'],
    type: 'website',
  }), []);

  if (status === 'loading') return (
    <div className="min-h-[60vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-8 text-center text-gray-600">Loading blogs...</div>
    </div>
  );
  if (status === 'failed') return (
    <div className="min-h-[60vh] bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="container mx-auto p-8 text-center text-red-600">{error || 'Failed to load blogs'}</div>
    </div>
  );

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-purple-500/15 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-cyan-400/20 text-cyan-700 text-sm font-medium">
              Blog & Insights
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Explore our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500">Blog Posts</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Stay updated with the latest tutorials, tips, and insights from our team.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-7xl mt-4 md:mt-8">
        {(!items || items.length === 0) && (
          <div className="text-center text-gray-600">No blog posts available.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((blog, idx) => (
            <motion.div 
              key={blog._id} 
              initial={{ opacity: 0, y: 24 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Card className="group relative rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm transition-all h-full flex flex-col overflow-hidden hover:shadow-xl">
                <CardContent className="p-0 flex flex-col h-full">
                  <Link to={`/blog/${blog.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-t-2xl">
                          {blog.featuredImage ? (
                            <img 
                              src={blog.featuredImage} 
                              alt={blog.title} 
                              className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      {blog.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full mb-2">
                          {blog.category.name}
                        </span>
                      )}
                      <Link to={`/blog/${blog.slug}`}>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors mt-2">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{blog.excerpt || ''}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {blog.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{blog.author.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(blog.publishedAt)}</span>
                          </div>
                          {blog.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{blog.readingTime} min read</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        Read more <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: page - 1 })}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: page + 1 })}
              disabled={page >= pages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
    </>
  );
};

export default React.memo(Blogs);

