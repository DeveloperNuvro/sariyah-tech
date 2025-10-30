import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/features/products/productSlice';
import { addToCart } from '@/features/dcart/cartSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const Products = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.products);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') return (
    <div className="min-h-[60vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-8 text-center text-gray-600">Loading products...</div>
    </div>
  );
  if (status === 'failed') return (
    <div className="min-h-[60vh] bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="container mx-auto p-8 text-center text-red-600">{error || 'Failed to load products'}</div>
    </div>
  );

  return (
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
              Premium Digital Library
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Explore our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500">Digital Products</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Carefully crafted ebooks and software to boost your learning and productivity.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-7xl mt-4 md:mt-8">
        {(!items || items.length === 0) && (
          <div className="text-center text-gray-600">No products available.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((p, idx) => {
            const price = p.discountPrice > 0 ? p.discountPrice : p.price;
            return (
              <motion.div key={p._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.05 }}>
                <Card className="group relative rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm transition-all">
                  <CardContent className="p-0">
                    <div className="p-3">
                      <Link to={`/product/${p.slug}`} className="block">
                        <div className="relative overflow-hidden rounded-xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-pink-500/0 group-hover:from-cyan-500/10 group-hover:to-pink-500/10 transition-colors" />
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt={p.title} className="w-full aspect-square object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-105" />
                          ) : p.files && p.files.length > 0 && String(p.files[0].format).toLowerCase() === 'pdf' ? (
                            <div className="w-full aspect-square rounded-xl overflow-hidden ring-1 ring-gray-200 bg-white">
                              <embed src={`${import.meta.env.VITE_API_BASE || 'http://localhost:8900/api'}/products/preview/${encodeURIComponent(p.files[0].publicId || '')}#zoom=120&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full pointer-events-none" />
                            </div>
                          ) : (
                            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />
                          )}
                        </div>
                      </Link>
                      <div className="mt-3">
                        <Link to={`/product/${p.slug}`} className="font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                          {p.title}
                        </Link>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{p.description}</p>
                      </div>
                    </div>
                    <div className="px-3 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-gray-100 text-gray-900">
                            {price} ৳
                            {p.discountPrice > 0 && (
                              <span className="ml-1 text-xs text-gray-500 line-through">{p.price} ৳</span>
                            )}
                          </span>
                        </div>
                        <Button
                          onClick={() => {
                            if (!isAuthenticated || user?.role !== 'student') {
                              const redirect = `/login?redirect=${encodeURIComponent(location.pathname)}`;
                              navigate(redirect);
                              return;
                            }
                            dispatch(addToCart({ productId: p._id, quantity: 1 }))
                              .unwrap()
                              .then(() => toast.success('Added to cart'))
                              .catch((e) => toast.error(e || 'Failed to add to cart'));
                          }}
                          className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white"
                          size="sm"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 via-fuchsia-400/0 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Products;
