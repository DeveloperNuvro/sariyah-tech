import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchProductBySlug } from '@/features/products/productSlice';
import { addToCart } from '@/features/dcart/cartSlice';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { current, status, error } = useSelector((s) => s.products);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug]);

  if (status === 'loading' || !current) return (
    <div className="min-h-[60vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-8 text-center text-gray-600">Loading...</div>
    </div>
  );
  if (status === 'failed') return (
    <div className="min-h-[60vh] bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="container mx-auto p-8 text-center text-red-600">{error || 'Failed to load product'}</div>
    </div>
  );

  const price = current.discountPrice > 0 ? current.discountPrice : current.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <section className="relative py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-purple-500/15 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="relative overflow-hidden rounded-xl">
                    {current.thumbnail ? (
                      <img src={current.thumbnail} alt={current.title} className="w-full aspect-square object-cover rounded-xl" />
                    ) : current.files && current.files.length > 0 && String(current.files[0].format).toLowerCase() === 'pdf' ? (
                      <div className="w-full rounded-xl ring-1 ring-gray-200 overflow-hidden bg-white">
                        <div className="relative" style={{height: "520px"}}>
                          <embed src={`${import.meta.env.VITE_API_BASE || 'http://localhost:8900/api'}/products/preview/${encodeURIComponent(current.files[0].publicId || '')}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full pointer-events-none select-none" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
                          <div className="pointer-events-none absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Preview</div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />)
                    }
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {current.title}
                </h1>
                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {current.description}
                </p>
                <div className="mt-6 text-3xl font-extrabold text-gray-900">
                  {price} ৳ {current.discountPrice > 0 && (
                    <span className="ml-3 text-lg text-gray-400 line-through">{current.price} ৳</span>
                  )}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <Button
                    onClick={() => {
                      if (!isAuthenticated || user?.role !== 'student') {
                        const redirect = `/login?redirect=${encodeURIComponent(location.pathname)}`;
                        navigate(redirect);
                        return;
                      }
                      dispatch(addToCart({ productId: current._id, quantity: 1 }))
                        .unwrap()
                        .then(() => toast.success('Added to cart'))
                        .catch((e) => toast.error(e || 'Failed to add to cart'));
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white"
                  >
                    Add to Cart
                  </Button>
                  {current.files && current.files.length > 0 && (
                    <Button variant="outline" className="cursor-default" disabled>
                      Download available after purchase
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
