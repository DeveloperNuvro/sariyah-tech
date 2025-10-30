import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FileText, ShoppingBag } from 'lucide-react';
import { fetchAllDigitalOrdersAdmin, updateDigitalOrderStatusAdmin } from '@/features/dorders/dorderSlice';

const DigitalOrdersAdminPage = () => {
  const dispatch = useDispatch();
  const { adminOrders = [], status } = useSelector((s) => s.dorders);

  useEffect(() => { dispatch(fetchAllDigitalOrdersAdmin()); }, [dispatch]);

  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <section className="container mx-auto px-4 max-w-7xl py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Digital Product Orders</h1>

        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : adminOrders.length === 0 ? (
          <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No digital orders found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminOrders.map((o) => (
              <Card key={o._id} className="p-6 rounded-2xl shadow bg-white/90 border border-gray-200/60">
                <CardHeader className="p-0 pb-3 border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900">Order #{o._id.slice(-6)}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-3 space-y-2 text-gray-700">
                  <p><span className="font-medium">Buyer:</span> {o.buyerInfo?.name || o.user?.name} ({o.buyerInfo?.email || o.user?.email}{o.buyerInfo?.phone ? `, ${o.buyerInfo.phone}` : ''})</p>
                  <p><span className="font-medium">Amount:</span> ${o.amount?.toFixed ? o.amount.toFixed(2) : o.amount}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Payment:</span>
                    <span className="capitalize">{o.paymentMethod}</span>
                    <select
                      className="ml-2 border rounded-md px-2 py-1 text-sm"
                      defaultValue={o.paymentStatus}
                      onChange={(e) => {
                        const paymentStatus = e.target.value;
                        const transactionId = o.transactionId;
                        dispatch(updateDigitalOrderStatusAdmin({ id: o._id, paymentStatus, transactionId }));
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="failed">failed</option>
                    </select>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-medium mb-1">Items</p>
                    <ul className="space-y-1 text-sm">
                      {(o.items || []).map((it, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span>{it.titleSnapshot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DigitalOrdersAdminPage;


