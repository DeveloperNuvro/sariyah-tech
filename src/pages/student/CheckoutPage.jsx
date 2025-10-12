// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchCourseById } from '../../features/courses/courseSlice';
import { createOrder } from '../../features/orders/orderSlice';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Copy,
  ExternalLink,
  Lock,
  Clock,
  Star
} from 'lucide-react';

// Import our UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckoutPageSkeleton } from '@/components/CheckoutPageSkeleton';

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

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCourse } = useSelector((state) => state.courses);
  const { status: orderStatus } = useSelector((state) => state.orders);

  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'bkash',
    paymentNumber: '',
    transactionId: '',
    paymentSlip: null,
  });

  // Payment numbers for each method
  const paymentNumbers = {
    bkash: '01623764873',
    nagad: '01933650706',
    rocket: '01933650706',
    cellfin: '01623764873'
  };

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [courseId, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentDetails.paymentNumber || !paymentDetails.transactionId || !paymentDetails.paymentSlip) {
        toast.error('Please fill in all required payment details and upload payment slip.');
        return;
    }
    
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('paymentMethod', paymentDetails.paymentMethod);
    formData.append('paymentNumber', paymentDetails.paymentNumber);
    formData.append('transactionId', paymentDetails.transactionId);
    formData.append('paymentSlip', paymentDetails.paymentSlip);

    dispatch(createOrder(formData))
      .unwrap()
      .then(() => {
        toast.success('🎉 Enrollment request submitted! Please wait for admin approval.');
        navigate('/dashboard/my-courses');
      })
      .catch((err) => {
        toast.error(err.message || 'An unexpected error occurred.');
      });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const isLoading = orderStatus === 'loading';

  if (!currentCourse) {
    return <CheckoutPageSkeleton />;
  }

  const currentPrice = currentCourse.discountPrice && currentCourse.discountPrice < currentCourse.price 
    ? currentCourse.discountPrice 
    : currentCourse.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-2 border-cyan-400/20 hover:bg-cyan-400/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600 text-lg">
              Secure payment for {currentCourse.title}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Payment Form */}
          <motion.div
            variants={animationVariants.container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Payment Instructions */}
            <motion.div variants={animationVariants.fadeInUp}>
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    Payment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        How to Pay:
                      </h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Send money to the number below using your selected payment method</li>
                        <li>Copy the transaction ID from your payment app</li>
                        <li>Fill in your payment details below</li>
                        <li>Submit your enrollment request</li>
                      </ol>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Bkash</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentNumbers.bkash)}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-lg font-mono font-bold text-gray-900">{paymentNumbers.bkash}</p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Nagad</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentNumbers.nagad)}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-lg font-mono font-bold text-gray-900">{paymentNumbers.nagad}</p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Rocket</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentNumbers.rocket)}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-lg font-mono font-bold text-gray-900">{paymentNumbers.rocket}</p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Cellfin</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(paymentNumbers.cellfin)}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-lg font-mono font-bold text-gray-900">{paymentNumbers.cellfin}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Form */}
            <motion.div variants={animationVariants.fadeInUp}>
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Method */}
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                        Payment Method *
                      </Label>
                      <Select 
                        value={paymentDetails.paymentMethod} 
                        onValueChange={(value) => setPaymentDetails({...paymentDetails, paymentMethod: value})}
                      >
                        <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl">
                          <SelectItem value="bkash" className="hover:bg-blue-50">💳 Bkash</SelectItem>
                          <SelectItem value="nagad" className="hover:bg-blue-50">💳 Nagad</SelectItem>
                          <SelectItem value="rocket" className="hover:bg-blue-50">💳 Rocket</SelectItem>
                          <SelectItem value="cellfin" className="hover:bg-blue-50">💳 Cellfin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Payment Number */}
                    <div className="space-y-2">
                      <Label htmlFor="paymentNumber" className="text-sm font-medium text-gray-700">
                        Your Payment Number *
                      </Label>
                      <Input
                        id="paymentNumber"
                        type="tel"
                        placeholder="Enter your payment number"
                        value={paymentDetails.paymentNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, paymentNumber: e.target.value})}
                        className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                        required
                      />
                    </div>

                    {/* Transaction ID */}
                    <div className="space-y-2">
                      <Label htmlFor="transactionId" className="text-sm font-medium text-gray-700">
                        Transaction ID *
                      </Label>
                      <Input
                        id="transactionId"
                        type="text"
                        placeholder="Enter transaction ID from your payment app"
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                        className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                        required
                      />
                    </div>

                    {/* Payment Slip Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="paymentSlip" className="text-sm font-medium text-gray-700">
                        Payment Slip Screenshot *
                      </Label>
                      <div className="space-y-2">
                        <Input
                          id="paymentSlip"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPaymentDetails({...paymentDetails, paymentSlip: e.target.files[0]})}
                          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Upload a screenshot of your payment confirmation from your mobile banking app
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl h-12 text-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Complete Purchase
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Order Summary */}
          <motion.div
            variants={animationVariants.fadeInUp}
            initial="hidden"
            animate="show"
            className="lg:sticky lg:top-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200/50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Star className="w-5 h-5 text-purple-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Course Info */}
                  <div className="flex gap-4">
                    <img 
                      src={currentCourse.thumbnail} 
                      alt={currentCourse.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{currentCourse.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{currentCourse.instructor?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {currentCourse.category?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      {currentCourse.discountPrice && currentCourse.discountPrice < currentCourse.price ? (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Course Price:</span>
                            <span className="text-gray-500 line-through">৳{currentCourse.price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Discount Price:</span>
                            <span className="text-lg font-bold text-green-600">৳{currentCourse.discountPrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">You Save:</span>
                            <span className="text-green-600 font-semibold">৳{currentCourse.price - currentCourse.discountPrice}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Course Price:</span>
                          <span className="text-lg font-bold text-gray-900">৳{currentCourse.price}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-gray-900">৳{currentPrice}</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Secure Payment</h4>
                        <p className="text-sm text-green-800">
                          Your payment information is encrypted and secure. We'll verify your payment and activate your course access.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Processing Time */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Processing Time</h4>
                        <p className="text-sm text-blue-800">
                          Your enrollment will be processed within 24 hours after payment verification.
                        </p>
                      </div>
          </div>
        </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
      </div>
    </main>
    </div>
  );
};

export default CheckoutPage;