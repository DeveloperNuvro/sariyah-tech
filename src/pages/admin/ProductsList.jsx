import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const ProductsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [onlyPublished, setOnlyPublished] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/products/admin');
      setItems(data.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setItems((prev) => prev.filter(p => p._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
      <section className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Digital Products</h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-64">
              <Input placeholder="Search title..." value={q} onChange={(e)=>setQ(e.target.value)} />
            </div>
            <Button onClick={() => navigate('/admin/products/new')} className="cursor-pointer">Add Product</Button>
          </div>
        </motion.div>
        <div className="md:hidden mb-4">
          <Label htmlFor="q" className="text-sm text-gray-700">Search</Label>
          <Input id="q" placeholder="Search title..." value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items
              .filter(p => (onlyPublished ? p.isPublished : true))
              .filter(p => (q ? (p.title||'').toLowerCase().includes(q.toLowerCase()) : true))
              .map((p, idx) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx*0.03 }}>
              <Card className="group relative rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 grid grid-cols-5 gap-3 items-center">
                    <div className="col-span-2">
                      <div className="relative rounded-xl overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.title} className="w-full aspect-square object-cover" />
                        ) : (p.files?.[0]?.format === 'pdf') ? (
                          <embed src={`${import.meta.env.VITE_API_BASE || 'http://localhost:8900/api'}/products/preview/${encodeURIComponent(p.files?.[0]?.publicId || '')}#toolbar=0`} type="application/pdf" className="w-full h-full" />
                        ) : (
                          <div className="w-full aspect-square" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 space-y-1">
                      <div className="text-sm text-gray-900 font-semibold line-clamp-2">{p.title}</div>
                      <div className="text-xs text-gray-600 line-clamp-2">{p.description}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-sm">
                          {p.discountPrice > 0 ? p.discountPrice : p.price} ৳
                          {p.discountPrice > 0 && <span className="text-xs text-gray-500 line-through ml-1">{p.price} ৳</span>}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.isPublished ? 'Published' : 'Draft'}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button asChild variant="outline" className="h-8 px-3 cursor-pointer">
                          <Link to={`/admin/products/${p._id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="destructive" onClick={() => onDelete(p._id)} className="h-8 px-3 cursor-pointer">Delete</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsList;


