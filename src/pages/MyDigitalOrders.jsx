import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '@/features/dorders/dorderSlice';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShoppingBag, FileText } from 'lucide-react';

const MyDigitalOrders = () => {
  const dispatch = useDispatch();
  const { myOrders } = useSelector((s) => s.dorders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <section className="container mx-auto px-4 max-w-7xl py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900"
        >
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">Digital Orders</span>
        </motion.h1>

        {(!myOrders || myOrders.length === 0) ? (
          <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No digital orders yet.</p>
              <Link to="/shop" className="inline-block mt-4 text-teal-600 hover:text-teal-700 font-medium">Go to Shop</Link>
            </CardContent>
          </Card>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {myOrders.map((o, index) => (
              <motion.div key={o._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <Card className="p-6 rounded-2xl bg-gradient-to-br from-white/90 to-purple-50/70 backdrop-blur-sm border border-gray-200/60 space-y-4">
                  <CardHeader className="p-0 pb-3 border-b border-gray-200">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-purple-500" /> Order #{o._id.slice(-6)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3 text-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">Amount</span>
                      <span className="text-gray-900 font-semibold">${o.amount?.toFixed ? o.amount.toFixed(2) : o.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">Payment</span>
                      <span className="capitalize">{o.paymentMethod}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">Status</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
                        o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        o.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {o.paymentStatus?.toUpperCase?.() || o.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">Date</span>
                      <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                    {o.transactionId && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">Txn ID</span>
                        <span className="font-mono text-xs text-gray-600">{o.transactionId}</span>
                      </div>
                    )}

                    {o.buyerInfo && (
                      <div className="mt-3 p-3 rounded-xl bg-white/70 border border-gray-200/70">
                        <h4 className="font-semibold text-gray-900 mb-2">Buyer</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Name:</span> <span className="text-gray-800">{o.buyerInfo.name}</span></p>
                          <p><span className="text-gray-600">Email:</span> <span className="text-gray-800">{o.buyerInfo.email}</span></p>
                          <p><span className="text-gray-600">Phone:</span> <span className="text-gray-800">{o.buyerInfo.phone}</span></p>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-2">Products</h4>
                      <ul className="space-y-1">
                        {(o.items || []).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>{item.titleSnapshot}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link 
                      to={`/digital-orders/${o._id}`} 
                      className="inline-flex w-full items-center justify-center mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl py-2.5 font-medium"
                    >
                      View Details & Downloads
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default MyDigitalOrders;


