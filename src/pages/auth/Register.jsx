// src/pages/auth/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

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
  },
  scaleIn: { 
    hidden: { scale: 0.95, opacity: 0 }, 
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    } 
  },
  slideInLeft: { 
    hidden: { x: -50, opacity: 0 }, 
    show: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    } 
  }
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student', // Fixed as student
  });
  
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'succeeded' && !error && !registrationSuccess) {
      // Registration successful - show verification message
      setRegistrationSuccess(true);
      setRegisteredEmail(formData.email);
      // Backend message is already shown in the response, but we can show a toast too
      toast.success('Please check your email to verify your account.');
    }
    if (status === 'failed' && error) {
      // Error is displayed in the UI component, but also show toast for visibility
      toast.error(error);
    }
  }, [status, error, registrationSuccess, formData.email]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (status === 'failed') {
      // Error will be cleared by Redux when a new action is dispatched
    }
  };

  const validateForm = () => {
    const name = formData.name?.trim() || '';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const password = formData.password || '';

    // Required fields
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields (Name, Email, Password).");
      return false;
    }

    // Name validation
    if (name.length < 2 || name.length > 100) {
      toast.error("Name must be between 2 and 100 characters.");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Phone validation (optional but validate if provided)
    if (phone && phone.length > 0) {
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        toast.error("Please enter a valid phone number with 7-15 digits.");
        return false;
      }
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    if (password.length > 128) {
      toast.error("Password must be less than 128 characters.");
      return false;
    }

    return true;
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(registerUser(formData));
  };

  const isLoading = status === 'loading';

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial="hidden"
          animate="show"
          variants={animationVariants.container}
          className="w-full max-w-md"
        >
          <motion.div variants={animationVariants.fadeInUp} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                Sariyah Tech
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Start your learning journey with us!</p>
          </motion.div>

          <motion.div variants={animationVariants.scaleIn}>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              {!registrationSuccess ? (
                <>
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      Student Registration
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Create your student account to start learning
                    </CardDescription>
                  </CardHeader>
              <CardContent>
                {status === 'failed' && error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </motion.div>
                )}
                <form onSubmit={onSubmit} className="space-y-5">
                  <motion.div variants={animationVariants.fadeInUp} className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div variants={animationVariants.fadeInUp} className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div variants={animationVariants.fadeInUp} className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={onChange}
                        required
                        disabled={isLoading}
                        className="h-12 border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={animationVariants.fadeInUp} className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={onChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </motion.div>
                  
                  
                  <motion.div variants={animationVariants.fadeInUp}>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold transition-all duration-300 group" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Student Account
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-semibold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent hover:from-cyan-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </>
            ) : (
              <>
                <CardHeader className="text-center pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    Check Your Email!
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    We've sent a verification link to your email address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-cyan-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-cyan-900 mb-1">
                          Verification Email Sent
                        </p>
                        <p className="text-sm text-cyan-700">
                          We've sent a verification link to <strong>{registeredEmail}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Next Steps
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                          <li>Check your inbox (and spam folder)</li>
                          <li>Click the verification link in the email</li>
                          <li>Once verified, you can log in to your account</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <Link to="/login">
                        Go to Login Page
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      Didn't receive the email?{' '}
                      <Link 
                        to="/login" 
                        className="text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        Resend verification
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </>
            )}
            </Card>
          </motion.div>

          <motion.div 
            variants={animationVariants.fadeInUp}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default RegisterPage;