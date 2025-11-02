import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { adminFetchBlogById, updateBlog } from '@/features/blogs/blogSlice';
import { fetchAllCategories } from '@/features/categories/categorySlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/RichTextEditor';
import toast from 'react-hot-toast';

const BlogEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, status } = useSelector((s) => s.blogs);
  const { categories } = useSelector((s) => s.categories);
  
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categories]);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  
  // SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [schemaType, setSchemaType] = useState('BlogPosting');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(adminFetchBlogById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setTitle(current.title || '');
      setContent(current.content || '');
      setExcerpt(current.excerpt || '');
      setMetaTitle(current.metaTitle || '');
      setMetaDescription(current.metaDescription || '');
      setMetaKeywords((current.metaKeywords || []).join(', '));
      setOgTitle(current.ogTitle || '');
      setOgDescription(current.ogDescription || '');
      setOgImage(current.ogImage || '');
      setCanonicalUrl(current.canonicalUrl || '');
      setCategory(current.category?._id || current.category || '');
      setTags((current.tags || []).join(', '));
      setIsPublished(!!current.isPublished);
      setSchemaType(current.schemaType || 'BlogPosting');
      setFeaturedImagePreview(current.featuredImage || '');
    }
  }, [current]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('content', content);
      if (excerpt !== undefined) fd.append('excerpt', excerpt);
      if (featuredImage) fd.append('featuredImage', featuredImage);
      if (metaTitle !== undefined) fd.append('metaTitle', metaTitle);
      if (metaDescription !== undefined) fd.append('metaDescription', metaDescription);
      if (metaKeywords) {
        metaKeywords.split(',').map(k => k.trim()).filter(Boolean).forEach(k => fd.append('metaKeywords[]', k));
      }
      if (ogTitle !== undefined) fd.append('ogTitle', ogTitle);
      if (ogDescription !== undefined) fd.append('ogDescription', ogDescription);
      if (ogImage !== undefined) fd.append('ogImage', ogImage);
      if (canonicalUrl !== undefined) fd.append('canonicalUrl', canonicalUrl);
      if (category) fd.append('category', category);
      if (tags) {
        tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => fd.append('tags[]', t));
      }
      fd.append('isPublished', String(isPublished));
      fd.append('schemaType', schemaType);

      await dispatch(updateBlog({ id, formData: fd })).unwrap();
      toast.success('Blog post updated successfully');
      navigate('/admin/blogs');
    } catch (e) {
      setError(e || 'Failed to update blog post');
      toast.error(e || 'Failed to update blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const onFeaturedImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFeaturedImage(file);
    if (file) {
      setFeaturedImagePreview(URL.createObjectURL(file));
    } else {
      setFeaturedImagePreview(current?.featuredImage || '');
    }
  };

  if (status === 'loading' || !current) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
      <section className="container mx-auto px-4 max-w-6xl">
        <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="p-5 pb-3 border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-gray-900">Edit Blog Post</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" placeholder="Blog post title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <textarea 
                      id="excerpt" 
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" 
                      placeholder="Short description..." 
                      value={excerpt} 
                      onChange={(e) => setExcerpt(e.target.value)} 
                      rows={3} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Write your blog content here..."
                    />
                    <p className="text-xs text-gray-500 mt-2">Use the editor toolbar to format your content with headings, bold, lists, links, and more.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select category</option>
                      {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="react, javascript, tutorial" value={tags} onChange={(e) => setTags(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schemaType">Schema Type</Label>
                    <select 
                      id="schemaType"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      value={schemaType}
                      onChange={(e) => setSchemaType(e.target.value)}
                    >
                      <option value="BlogPosting">Blog Posting</option>
                      <option value="Article">Article</option>
                      <option value="NewsArticle">News Article</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <Input type="file" name="featuredImage" accept="image/*" onChange={onFeaturedImageChange} />
                    {featuredImagePreview && (
                      <div className="mt-3">
                        <img src={featuredImagePreview} alt="Featured image preview" className="h-48 w-full rounded-lg object-cover ring-1 ring-gray-200" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-gray-900">SEO Settings</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title (max 60 chars)</Label>
                      <Input id="metaTitle" placeholder="SEO title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={60} />
                      <p className="text-xs text-gray-500">{metaTitle.length}/60</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description (max 160 chars)</Label>
                      <textarea 
                        id="metaDescription" 
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" 
                        placeholder="SEO description" 
                        value={metaDescription} 
                        onChange={(e) => setMetaDescription(e.target.value)} 
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500">{metaDescription.length}/160</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
                      <Input id="metaKeywords" placeholder="keyword1, keyword2" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">OG Title (max 95 chars)</Label>
                      <Input id="ogTitle" placeholder="Open Graph title" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} maxLength={95} />
                      <p className="text-xs text-gray-500">{ogTitle.length}/95</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogDescription">OG Description (max 200 chars)</Label>
                      <textarea 
                        id="ogDescription" 
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" 
                        placeholder="Open Graph description" 
                        value={ogDescription} 
                        onChange={(e) => setOgDescription(e.target.value)} 
                        rows={2}
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500">{ogDescription.length}/200</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input id="ogImage" placeholder="https://..." value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input id="canonicalUrl" placeholder="https://..." value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> 
                Publish
              </label>

              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={submitting} className="cursor-pointer">
                  {submitting ? 'Updating...' : 'Update Blog Post'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')} className="cursor-pointer">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default BlogEdit;

