// src/pages/auth/VerifyEmail.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

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
import { Mail, CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'resending'
  const [email, setEmail] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [error, setError] = useState('');
  const hasVerifiedRef = useRef(false); // Use ref to prevent duplicate calls

  const verifyEmail = useCallback(async (verificationToken) => {
    // Prevent duplicate calls
    if (hasVerifiedRef.current) {
      return;
    }
    hasVerifiedRef.current = true;

    try {
      const { data } = await api.get('/users/verify-email', {
        params: { token: verificationToken }
      });

      setStatus('success');
      toast.success(data.message || 'Email verified successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Reset ref on error so user can retry
      hasVerifiedRef.current = false;
      setStatus('error');
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to verify email';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setError('Verification token is missing');
    }
  }, [token, verifyEmail]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    if (!resendEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setStatus('resending');
    
    try {
      const { data } = await api.post('/users/resend-verification', {
        email: resendEmail
      });

      toast.success(data.message || 'Verification email sent! Please check your inbox.');
      setStatus('success');
      setEmail(resendEmail);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to resend verification email';
      toast.error(errorMessage);
      setStatus('error');
    }
  };

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <motion.div
        variants={animationVariants.container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            {status === 'verifying' && (
              <>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                  Verifying Your Email
                </CardTitle>
                <CardDescription>
                  Please wait while we verify your email address...
                </CardDescription>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Email Verified!
                </CardTitle>
                <CardDescription>
                  Your email has been successfully verified. You can now log in to your account.
                </CardDescription>
              </>
            )}

            {status === 'error' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4"
                >
                  <XCircle className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Verification Failed
                </CardTitle>
                <CardDescription className="text-red-600">
                  {error || 'Invalid or expired verification token'}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'error' && (
              <motion.div
                variants={animationVariants.fadeInUp}
                className="space-y-4"
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    {error.includes('expired') 
                      ? 'The verification link has expired. Please request a new verification email.'
                      : error}
                  </p>
                </div>

                <form onSubmit={handleResendVerification} className="space-y-4">
                  <div>
                    <Label htmlFor="resend-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white"
                    disabled={status === 'resending'}
                  >
                    {status === 'resending' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                variants={animationVariants.fadeInUp}
                className="text-center space-y-4"
              >
                <p className="text-sm text-gray-600">
                  Redirecting you to the login page...
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white"
                >
                  <Link to="/login">
                    Go to Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-gray-500">
              Need help?{' '}
              <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Contact Support
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

