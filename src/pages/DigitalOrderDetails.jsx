import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchDownloads, fetchOrderById } from '@/features/dorders/dorderSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const DigitalOrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { downloads, currentOrder, status, error } = useSelector((s) => s.dorders);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (currentOrder && currentOrder.paymentStatus === 'paid') {
      dispatch(fetchDownloads(orderId));
    }
  }, [dispatch, orderId, currentOrder]);

  if (status === 'loading') return (
    <div className="min-h-[60vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-8 text-center text-gray-600">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-[60vh] bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="container mx-auto p-8 text-center text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <section className="container mx-auto px-4 max-w-6xl py-12">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900 mb-6">Order Details</motion.h1>
        {currentOrder && (
          <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="p-5 pb-3 border-b border-gray-200">
              <CardTitle className="text-xl font-semibold text-gray-900">Order #{currentOrder._id?.slice(-6)}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p><span className="font-medium">Amount:</span> ${currentOrder.amount?.toFixed ? currentOrder.amount.toFixed(2) : currentOrder.amount}</p>
              <p><span className="font-medium">Payment:</span> <span className="capitalize">{currentOrder.paymentMethod}</span> • {currentOrder.paymentStatus}</p>
              <p><span className="font-medium">Transaction ID:</span> {currentOrder.transactionId || '-'}</p>
              <p><span className="font-medium">Date:</span> {new Date(currentOrder.createdAt).toLocaleString()}</p>
              {currentOrder.buyerInfo && (
                <div className="md:col-span-2 mt-2 p-3 rounded-xl bg-white/70 border border-gray-200/70">
                  <h4 className="font-semibold text-gray-900 mb-2">Buyer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> <span className="text-gray-800">{currentOrder.buyerInfo.name}</span></p>
                    <p><span className="text-gray-600">Email:</span> <span className="text-gray-800">{currentOrder.buyerInfo.email}</span></p>
                    <p><span className="text-gray-600">Phone:</span> <span className="text-gray-800">{currentOrder.buyerInfo.phone}</span></p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {(!currentOrder) ? (
          <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">Loading order details...</CardContent>
          </Card>
        ) : (currentOrder.paymentStatus !== 'paid') ? (
          <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
                {currentOrder?.paymentStatus ? currentOrder.paymentStatus.toUpperCase() : 'PENDING'}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Payment verification in progress</h3>
              <p className="mt-2 text-gray-600">Your order details are saved. Downloads will unlock as soon as we confirm your payment.</p>
              {currentOrder && (
                <div className="mt-4 text-sm text-gray-700">
                  <p><span className="font-medium">Payment Method:</span> <span className="capitalize">{currentOrder.paymentMethod}</span></p>
                  <p><span className="font-medium">Transaction ID:</span> {currentOrder.transactionId || '-'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloads.map((d, idx) => (
              <motion.div key={d.productId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                <Card className="rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="p-5 pb-3 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" /> {d.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-3">
                    {Array.isArray(d.files) && d.files.map((f, i) => (
                      <div key={f.url || i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center">
                              <Download className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{f.name}</div>
                            <div className="text-xs text-gray-500 truncate uppercase">{f.format}{f.sizeBytes ? ` • ${(f.sizeBytes/1024).toFixed(1)} KB` : ''}</div>
                          </div>
                        </div>
                        <Button asChild className="ml-3 shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                          <a href={f.url} target="_blank" rel="noreferrer">Download</a>
                        </Button>
                      </div>
                    ))}
                    {(!d.files || d.files.length === 0) && (
                      <div className="text-sm text-gray-500">No files available yet.</div>
                    )}
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

export default DigitalOrderDetails;
