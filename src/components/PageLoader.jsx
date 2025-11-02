import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-10, 10, -10],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: [1, 1.1, 1],
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.2, 0],
      opacity: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-violet-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Logo/Icon with pulse animation */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={logoVariants}
          initial="initial"
          animate="animate"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <motion.svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </motion.svg>
            </div>
            
            {/* Sparkles around logo */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
                style={{
                  top: `${Math.sin(i * Math.PI / 2) * 60}px`,
                  left: `${Math.cos(i * Math.PI / 2) * 60}px`,
                }}
                variants={sparkleVariants}
                transition={{ delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-full"
              variants={dotVariants}
              transition={{ delay: index * 0.15 }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-gray-600 font-medium text-lg"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading amazing content...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PageLoader;

