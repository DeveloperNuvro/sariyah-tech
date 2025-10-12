import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  BookOpen, 
  Calendar, 
  Hash, 
  Receipt, 
  Smartphone,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Animation variants
const animationVariants = {
  container: { 
    hidden: { opacity: 0 }, 
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2 
      } 
    } 
  },
  fadeInUp: { 
    hidden: { y: 30, opacity: 0 }, 
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    } 
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { myOrders } = useSelector((state) => state.orders);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Find the order from the existing orders
    const foundOrder = myOrders.find(o => o._id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      // If not found, redirect back to dashboard
      navigate('/dashboard/my-courses');
    }
  }, [orderId, myOrders, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/dashboard/my-courses')}
              className="border-2 border-indigo-200 hover:bg-indigo-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">Complete information about your order</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto space-y-6"
          variants={animationVariants.container}
          initial="hidden"
          animate="show"
        >
          {/* Order Information */}
          <motion.div variants={animationVariants.fadeInUp}>
            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Hash className="w-5 h-5 text-cyan-600" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Order ID</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                      {order._id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                      {order.transactionId || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Order Date</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Information */}
          <motion.div variants={animationVariants.fadeInUp}>
            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Payment Method</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        {order.paymentMethod?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Payment Number</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                      {order.paymentNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Amount</label>
                    <p className="text-lg font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                      ৳{order.amount || '0'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(order.paymentStatus)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Information */}
          <motion.div variants={animationVariants.fadeInUp}>
            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img 
                    src={order.course?.thumbnail} 
                    alt={order.course?.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
                  />
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {order.course?.title || 'N/A'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <img 
                          src={order.course?.instructor?.avatar} 
                          alt={order.course?.instructor?.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Instructor:</span> {order.course?.instructor?.name || 'N/A'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {order.course?.category?.name || 'N/A'}
                    </p>
                    <div className="flex items-center gap-2">
                      {order.course?.discountPrice && 
                       order.course?.discountPrice < order.course?.price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">৳{order.course?.discountPrice}</span>
                          <span className="text-sm text-gray-500 line-through">৳{order.course?.price}</span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Save ৳{order.course?.price - order.course?.discountPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">৳{order.course?.price || '0'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Slip */}
          {order.paymentSlip && (
            <motion.div variants={animationVariants.fadeInUp}>
              <Card className="bg-white border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Payment Slip
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <img 
                        src={order.paymentSlip} 
                        alt="Payment Slip"
                        className="w-full max-w-md mx-auto rounded-lg border shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={() => window.open(order.paymentSlip, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                          Click to view full size
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Payment confirmation screenshot you uploaded
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;
