import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProductEdit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [tags, setTags] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [files, setFiles] = useState([]);
  const [thumbPreview, setThumbPreview] = useState('');
  const [filePreviews, setFilePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.data;
        setProduct(p);
        setTitle(p.title || '');
        setDescription(p.description || '');
        setPrice(p.price ?? '');
        setDiscountPrice(p.discountPrice ?? '');
        setIsPublished(!!p.isPublished);
        setTags((p.tags || []).join(', '));
        setThumbPreview(p.thumbnail || '');
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('price', price);
      fd.append('discountPrice', discountPrice || 0);
      fd.append('isPublished', String(isPublished));
      if (tags) {
        tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => fd.append('tags[]', t));
      }
      if (thumbnail) fd.append('thumbnail', thumbnail);
      Array.from(files || []).forEach(f => fd.append('files', f));
      await api.put(`/products/${id}`, fd);
      navigate('/admin/products');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const onThumbChange = (e) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      setThumbPreview(URL.createObjectURL(file));
    } else {
      setThumbPreview(product?.thumbnail || '');
    }
  };

  const onFilesChange = (e) => {
    const list = e.target.files || [];
    setFiles(list);
    const previews = Array.from(list).map((f) => ({ name: f.name, type: f.type, url: URL.createObjectURL(f) }));
    setFilePreviews(previews);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
      <section className="container mx-auto px-4 max-w-6xl">
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-5 pb-3 border-b border-gray-200">
                <CardTitle className="text-xl font-semibold text-gray-900">Media</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                  <Label>Replace thumbnail</Label>
                  <Input type="file" name="thumbnail" accept="image/*" onChange={onThumbChange} />
                  {thumbPreview && (
                    <div className="mt-3">
                      <img src={thumbPreview} alt="thumbnail preview" className="h-28 w-28 rounded-lg object-cover ring-1 ring-gray-200" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Existing files</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {product?.files?.map((f) => (
                      <div key={f.url} className="border rounded-lg p-2 bg-white/60 space-y-2">
                        {String(f.format).toLowerCase() === 'pdf' ? (
                          <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-200">
                            <embed src={`${import.meta.env.VITE_API_BASE || 'http://localhost:8900/api'}/products/preview/${encodeURIComponent(f.publicId || '')}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full" />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] w-full grid place-items-center rounded-md bg-gray-50 ring-1 ring-gray-200 text-xs text-gray-600">{f.format?.toUpperCase() || 'FILE'}</div>
                        )}
                        <a href={f.url} target="_blank" rel="noreferrer" className="block text-xs text-indigo-700 truncate" title={f.name}>{f.name}</a>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" className="h-8 px-2" onClick={async ()=>{
                            if (!window.confirm('Delete this file?')) return;
                            try {
                              await api.delete(`/products/${product._id}/files`, { params: { publicId: f.publicId || '' } });
                              const { data } = await api.get(`/products/${product._id}`);
                              setProduct(data.data);
                            } catch (e) {
                              console.error(e);
                              alert(e?.response?.data?.message || 'Failed to delete file');
                            }
                          }}>Delete</Button>
                          <div>
                            <label className="text-xs text-gray-600">Replace</label>
                            <Input type="file" accept="application/pdf,application/zip" onChange={async (e)=>{
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append('files', file);
                              try {
                                await api.put(`/products/${product._id}/files/replace`, fd, { params: { publicId: f.publicId || '' } });
                                const { data } = await api.get(`/products/${product._id}`);
                                setProduct(data.data);
                              } catch (err) {
                                console.error(err);
                                alert(err?.response?.data?.message || 'Failed to replace file');
                              } finally {
                                e.target.value = '';
                              }
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Append files (PDF/ZIP)</Label>
                  <Input type="file" name="files" accept="application/pdf,application/zip" multiple onChange={onFilesChange} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-5 pb-3 border-b border-gray-200">
                <CardTitle className="text-xl font-semibold text-gray-900">Details</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Awesome PDF pack" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <textarea id="desc" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Write a compelling description..." value={description} onChange={(e)=>setDescription(e.target.value)} rows={6} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" type="number" min="0" placeholder="0" value={price} onChange={(e)=>setPrice(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount Price</Label>
                      <Input id="discount" type="number" min="0" placeholder="Optional" value={discountPrice} onChange={(e)=>setDiscountPrice(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="design, ebook, templates" value={tags} onChange={(e)=>setTags(e.target.value)} />
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)} /> Publish
                  </label>
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" disabled={submitting} className="cursor-pointer">{submitting ? 'Saving...' : 'Update Product'}</Button>
                    <Button type="button" variant="outline" onClick={()=>navigate('/admin/products')} className="cursor-pointer">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductEdit;


