import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateItem, removeItem, clearCart } from '@/features/dcart/cartSlice';
import { checkout } from '@/features/dorders/dorderSlice';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, subtotal, status } = useSelector((s) => s.dcart);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [transactionId, setTransactionId] = useState('');
  const { user } = useSelector((s) => s.auth || {});
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const navigate = useNavigate();
  const doCheckout = () => {
    // Basic form validation
    const phoneValid = /^[0-9+\-()\s]{7,20}$/.test(buyerPhone);
    if (!buyerName || !buyerEmail || !phoneValid || !paymentMethod || !transactionId) {
      toast.error('Please fill name, valid email, valid phone, payment method and transaction id.');
      return;
    }
    dispatch(checkout({ paymentMethod, transactionId, buyerInfo: { name: buyerName, email: buyerEmail, phone: buyerPhone } }))
      .unwrap()
      .then((order) => {
        toast.success('Order placed successfully');
        // empty cart after successful order
        dispatch(clearCart());
        if (order && order._id) navigate(`/digital-orders/${order._id}`);
      })
      .catch((e) => toast.error(e || 'Failed to place order'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <section className="container mx-auto px-4 max-w-6xl py-12">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900 mb-6">Your Cart</motion.h1>
        {status === 'loading' && <div className="text-gray-600">Loading...</div>}
        {(!items || items.length === 0) ? (
          <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">Your cart is empty.</CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <Card key={it.product._id} className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {it.product.thumbnail && <img src={it.product.thumbnail} alt={it.product.title} className="w-20 h-20 object-cover rounded-xl" />}
                        <div>
                          <div className="font-semibold text-gray-900">{it.product.title}</div>
                          <div className="text-sm text-gray-600">{it.price} ৳</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" min="1" value={it.quantity} onChange={(e)=>dispatch(updateItem({ productId: it.product._id, quantity: Number(e.target.value) }))} className="w-20 border rounded px-2 py-1" />
                        <Button onClick={()=>dispatch(removeItem(it.product._id))} variant="destructive" className="cursor-pointer">Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">Subtotal</div>
                    <div className="text-2xl font-extrabold text-gray-900">{subtotal} ৳</div>
                  </div>
                  <Button onClick={()=>dispatch(clearCart())} variant="outline" className="mt-3 w-full cursor-pointer">Clear Cart</Button>
                  <div className="mt-5 grid grid-cols-1 gap-3">
                    <input placeholder="Your name" value={buyerName} onChange={(e)=>setBuyerName(e.target.value)} className="border rounded px-3 py-2" required />
                    <input placeholder="Email" type="email" value={buyerEmail} onChange={(e)=>setBuyerEmail(e.target.value)} className="border rounded px-3 py-2" required />
                    <input placeholder="Phone" type="tel" pattern="[0-9+\-()\s]{7,20}" value={buyerPhone} onChange={(e)=>setBuyerPhone(e.target.value)} className="border rounded px-3 py-2" required />
                    <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="border rounded px-3 py-2" required>
                      <option value="bkash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Upay">Upay</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Cellfin">Cellfin</option>
                    </select>
                    <input value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} placeholder="Transaction ID" className="border rounded px-3 py-2" required />
                    <Button onClick={doCheckout} className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white cursor-pointer">Place Order</Button>
                    <p className="text-sm text-gray-500">For free items, you can leave payment fields empty.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;
