// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchCourseById } from '../../features/courses/courseSlice';
import { createOrder } from '../../features/orders/orderSlice';

// Import our UI components
import { OrderSummary } from '@/components/OrderSummary';
import { PaymentForm } from '@/components/PaymentForm';
import { CheckoutPageSkeleton } from '@/components/CheckoutPageSkeleton';

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCourse } = useSelector((state) => state.courses);
  const { status: orderStatus } = useSelector((state) => state.orders);

  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'bkash',
    paymentNumber: '',
    transactionId: '', // New field is here
  });

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [courseId, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentDetails.paymentNumber || !paymentDetails.transactionId) {
        toast.error('Please fill in all required payment details.');
        return;
    }
    
    const orderData = {
        courseId,
        paymentMethod: paymentDetails.paymentMethod,
        paymentNumber: paymentDetails.paymentNumber,
        transactionId: paymentDetails.transactionId
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        toast.success('Enrollment request submitted! Please wait for admin approval.');
        navigate('/dashboard/my-courses');
      })
      .catch((err) => {
        toast.error(err.message || 'An unexpected error occurred.');
      });
  };

  const isLoading = orderStatus === 'loading';

  if (!currentCourse) {
    return <CheckoutPageSkeleton />;
  }

  return (
    <main className="bg-gray-50/50 dark:bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Column: Payment Form */}
          <PaymentForm
            handleSubmit={handleSubmit}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            isLoading={isLoading}
          />
          
          {/* Right Column: Order Summary */}
          <div className="mt-10 lg:mt-0">
            <OrderSummary course={currentCourse} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;