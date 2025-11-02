import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogBySlug, fetchBlogSEO, fetchRelatedBlogs, clearCurrent } from '@/features/blogs/blogSlice';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { current, seo, related, status, error } = useSelector((s) => s.blogs);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug));
      dispatch(fetchBlogSEO(slug));
      dispatch(fetchRelatedBlogs(slug));
    }

    return () => {
      dispatch(clearCurrent());
    };
  }, [dispatch, slug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (status === 'loading' || !current) return (
    <div className="min-h-[60vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-8 text-center text-gray-600">Loading blog post...</div>
    </div>
  );
  if (status === 'failed') return (
    <div className="min-h-[60vh] bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="container mx-auto p-8 text-center text-red-600">{error || 'Failed to load blog post'}</div>
    </div>
  );

  return (
    <>
      <SEO
        title={seo?.metaTitle || current.title}
        description={seo?.metaDescription || current.excerpt}
        keywords={seo?.metaKeywords || current.metaKeywords || []}
        ogTitle={seo?.ogTitle || current.ogTitle}
        ogDescription={seo?.ogDescription || current.ogDescription}
        ogImage={seo?.ogImage || current.ogImage || current.featuredImage}
        canonicalUrl={seo?.canonicalUrl || seo?.url}
        structuredData={seo?.structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <section className="relative py-10 md:py-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-purple-500/15 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Header */}
              <div className="mb-8">
                {current.category && (
                  <Link to={`/blogs?category=${current.category._id}`}>
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full mb-4 hover:bg-indigo-200 transition-colors">
                      {current.category.name}
                    </span>
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {current.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{current.author.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(current.publishedAt)}</span>
                  </div>
                  {current.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{current.readingTime} min read</span>
                    </div>
                  )}
                  {current.viewCount > 0 && (
                    <span>{current.viewCount} views</span>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {current.featuredImage && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img 
                    src={current.featuredImage} 
                    alt={current.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg prose-slate max-w-none blog-content-wrapper">
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: current.content }}
                />
              </div>

              {/* Tags */}
              {current.tags && current.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {current.tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={`/blogs?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Info */}
              {current.author && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <Card className="rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {current.author.avatar ? (
                          <img 
                            src={current.author.avatar} 
                            alt={current.author.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                            {current.author.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{current.author.name}</h4>
                          {current.author.bio && (
                            <p className="text-sm text-gray-600">{current.author.bio}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Related Posts */}
        {related && related.length > 0 && (
          <section className="container mx-auto px-4 max-w-7xl pb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                            />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100" />
                          )}
                        </div>
                      </Link>
                      <div className="p-5 flex-1 flex flex-col">
                        <Link to={`/blog/${blog.slug}`}>
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors mb-2">
                            {blog.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{blog.excerpt || ''}</p>
                        <Link 
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-1 mt-auto text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          Read more <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogDetail;

