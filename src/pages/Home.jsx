// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Lucide React Icons
import { 
  Code, Bot, Smartphone, Globe, BookOpen, Star, Rocket, Users, Target, 
  Terminal, Briefcase, PlayCircle, ChevronDown, Quote, ArrowRight, 
  CheckCircle, Award, TrendingUp, Clock, GraduationCap, Zap, 
  Shield, Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram,
  Linkedin, Youtube, Search, Filter, Eye, ThumbsUp, MessageCircle,
  Laptop, Database, Cpu, Layers, Palette, Smartphone as Mobile, XCircle
} from 'lucide-react';

// Your Redux Action
import { fetchAllCourses } from '../features/courses/courseSlice';
import { Link } from 'react-router-dom';
import { CourseCard } from '../components/CourseCard';
import DarkLogo from "../assets/images/DarkLogo.png";

// Reusable Animation Variants
const animationVariants = {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
    fadeInUp: { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } },
    scaleIn: { hidden: { scale: 0.95, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } },
    slideInLeft: { hidden: { x: -50, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } },
    slideInRight: { hidden: { x: 50, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } }
};

// --- SECTION COMPONENTS ---

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Ultra Vibrant Background */}
            <div className="absolute inset-0 z-0">
                {/* Animated gradient orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400/60 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-40 right-32 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute bottom-32 left-40 w-5 h-5 bg-yellow-400/60 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            <div className="relative z-10 px-6 py-20 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto lg:px-12 xl:px-16">
                    {/* Left Content */}
                    <motion.div
                        className="text-center lg:text-left"
                        initial="hidden"
                        animate="show"
                        variants={animationVariants.container}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400/20 to-pink-400/20 border border-cyan-400/30 text-cyan-300 text-sm font-medium mb-6 shadow-lg backdrop-blur-sm"
                            variants={animationVariants.fadeInUp}
                        >
                            <Zap className="w-4 h-4 text-yellow-400" />
                            Premier Tech Development & Learning Platform
                        </motion.div>
                        
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white"
                            variants={animationVariants.fadeInUp}
                        >
                            Build & Learn with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 animate-pulse">
                                Sariyah Tech
                            </span>
                        </motion.h1>
                        
                        <motion.p
                            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed"
                            variants={animationVariants.fadeInUp}
                        >
                            We develop cutting-edge software, websites, mobile apps, and AI agents for businesses worldwide. 
                            Plus, we teach you how to build them yourself through our comprehensive courses.
                        </motion.p>
                        
                        <motion.div
                            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            variants={animationVariants.fadeInUp}
                        >
                            <Button size="lg" className="group text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                                Start Your Project
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                            <Link to="/courses">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Explore Courses
                                </Button>
                            </Link>
                        </motion.div>
                        
                        {/* Trust Indicators */}
                        <motion.div
                            className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-300"
                            variants={animationVariants.fadeInUp}
                        >
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                <Users className="w-4 h-4 text-cyan-400" />
                                <span>50+ Projects Delivered</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                <BookOpen className="w-4 h-4 text-pink-400" />
                                <span>200+ Students Taught</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span>100% Client Satisfaction</span>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    {/* Right Content - Services Showcase */}
                    <motion.div
                        className="relative"
                        initial="hidden"
                        animate="show"
                        variants={animationVariants.scaleIn}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div 
                                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-cyan-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/30 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Laptop className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Web Development</h3>
                                <p className="text-sm text-gray-300">Modern, responsive websites</p>
                            </motion.div>
                            
                            <motion.div 
                                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-pink-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400/30 to-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Mobile className="w-6 h-6 text-pink-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Mobile Apps</h3>
                                <p className="text-sm text-gray-300">iOS & Android applications</p>
                            </motion.div>
                            
                            <motion.div 
                                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-yellow-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Bot className="w-6 h-6 text-yellow-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">AI Agents</h3>
                                <p className="text-sm text-gray-300">Intelligent automation</p>
                            </motion.div>
                            
                            <motion.div 
                                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400/30 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Database className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Software Solutions</h3>
                                <p className="text-sm text-gray-300">Custom business software</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <ChevronDown className="w-6 h-6 text-cyan-400" />
            </motion.div>
        </section>
    );
};

const ServicesSection = () => {
    const services = [
        {
            icon: Laptop,
            title: "Web Development",
            description: "Modern, responsive websites and web applications using React, Next.js, and cutting-edge technologies.",
            features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Modern UI/UX"],
            color: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            borderColor: "border-blue-200/50",
            hoverBorder: "group-hover:border-blue-300/70"
        },
        {
            icon: Mobile,
            title: "Mobile App Development",
            description: "Native and cross-platform mobile applications for iOS and Android with seamless user experience.",
            features: ["iOS & Android", "Cross-Platform", "Native Performance", "App Store Ready"],
            color: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            borderColor: "border-purple-200/50",
            hoverBorder: "group-hover:border-purple-300/70"
        },
        {
            icon: Bot,
            title: "AI Agent Development",
            description: "Intelligent AI agents and automation solutions to streamline your business processes.",
            features: ["Chatbots", "Process Automation", "Machine Learning", "API Integration"],
            color: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            borderColor: "border-green-200/50",
            hoverBorder: "group-hover:border-green-300/70"
        },
        {
            icon: Database,
            title: "Custom Software",
            description: "Tailored software solutions designed specifically for your business needs and requirements.",
            features: ["Custom Solutions", "Scalable Architecture", "Database Design", "API Development"],
            color: "from-orange-500 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            borderColor: "border-orange-200/50",
            hoverBorder: "group-hover:border-orange-300/70"
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/3 to-orange-500/3 rounded-full blur-3xl"></div>
            </div>

            <div className="container px-4 max-w-7xl mx-auto relative z-10">
                <motion.div 
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={animationVariants.fadeInUp}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400/10 to-pink-400/10 border border-cyan-400/20 text-cyan-600 text-sm font-medium mb-6 shadow-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Rocket className="w-4 h-4 text-cyan-500" />
                        Premium Development Services
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900">
                        Our{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500">
                            Development Services
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        From concept to deployment, we deliver world-class software solutions that drive your business forward. 
                        Our expert team combines cutting-edge technology with proven methodologies.
                    </p>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={animationVariants.container}
                >
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={animationVariants.fadeInUp}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <Card className={`bg-gradient-to-br ${service.bgGradient} backdrop-blur-sm border-2 ${service.borderColor} ${service.hoverBorder} transition-all duration-300 group overflow-hidden relative`}>
                                    
                                    <CardHeader className="text-center pb-4 relative z-10 pt-6">
                                        <motion.div 
                                            className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300`}
                                            whileHover={{ rotate: 5, scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                                            {service.title}
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="px-6 pb-4 relative z-10">
                                        <p className="text-gray-600 mb-4 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm">
                                            {service.description}
                                        </p>
                                        <div className="space-y-2">
                                            {service.features.map((feature, i) => (
                                                <motion.div 
                                                    key={i} 
                                                    className="flex items-center gap-2 text-xs group/item"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                                    viewport={{ once: true }}
                                                >
                                                    <motion.div
                                                        className={`w-5 h-5 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center flex-shrink-0`}
                                                        whileHover={{ scale: 1.1, rotate: 180 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    </motion.div>
                                                    <span className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">
                                                        {feature}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    
                                    <CardFooter className="px-6 pb-6 relative z-10">
                                        <motion.div
                                            className="w-full"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white border-0 transition-all duration-300 py-2 text-sm font-semibold group/btn`}>
                                                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                                                    Learn More
                                                </span>
                                                <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </motion.div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Enhanced CTA Section */}
                <motion.div 
                    className="text-center mt-16"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={animationVariants.fadeInUp}
                >
                    <div className="bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl p-8 border border-cyan-200/30 backdrop-blur-sm">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Ready to Start Your Project?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Let's discuss your requirements and create something amazing together. 
                            Our team is ready to bring your vision to life.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white transition-all duration-300 px-8 py-4 text-lg font-semibold group">
                                Get Started Today
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const StatsSection = () => {
    const stats = [
        { number: "50+", label: "Projects Delivered", icon: Rocket, color: "from-blue-500 to-cyan-500" },
        { number: "200+", label: "Students Taught", icon: Users, color: "from-purple-500 to-pink-500" },
        { number: "100%", label: "Client Satisfaction", icon: Award, color: "from-green-500 to-emerald-500" },
        { number: "24/7", label: "Support Available", icon: Shield, color: "from-orange-500 to-red-500" },
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-primary/5 via-white to-accent/5">
            <div className="container px-4 max-w-7xl mx-auto">
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={animationVariants.container}
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                className="text-center group"
                                variants={animationVariants.fadeInUp}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex flex-col items-center">
                                    <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

const FeaturedCoursesSection = () => {
    const dispatch = useDispatch();
    const { courses, status, error } = useSelector((state) => state.courses);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Only fetch courses if they haven't been loaded yet
        if (status === 'idle' || courses.length === 0) {
            dispatch(fetchAllCourses());
        }
    }, [dispatch, status, courses.length]);

    // Filter courses based on search term
    const filteredCourses = courses?.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const featuredCourses = filteredCourses.slice(0, 6);

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container px-4 max-w-7xl mx-auto relative z-10">
                <motion.div 
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={animationVariants.fadeInUp}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/10 to-pink-400/10 border border-cyan-400/20 text-cyan-600 text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        Featured Learning Paths
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
                        Learn from{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500">
                            Industry Experts
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Master the same technologies we use in our projects. From beginner to advanced, we've got you covered.
                    </p>
                </motion.div>

                {/* Enhanced Search Bar */}
                <motion.div 
                    className="max-w-lg mx-auto mb-12"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={animationVariants.fadeInUp}
                >
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 group-focus-within:text-pink-500 transition-colors" />
                        <Input
                            placeholder="Search courses, categories, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-cyan-400/20 focus:border-pink-400/40 shadow-lg hover:shadow-xl transition-all duration-300 text-lg rounded-xl"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Search Results Info */}
                {searchTerm && (
                    <motion.div 
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-gray-600">
                            Found <span className="font-semibold text-cyan-600">{filteredCourses.length}</span> courses matching "{searchTerm}"
                        </p>
                    </motion.div>
                )}

                {status === 'loading' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                                <CardContent className="p-6">
                                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                                    <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : status === 'failed' ? (
                    <motion.div 
                        className="text-center py-12"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={animationVariants.fadeInUp}
                    >
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Courses</h3>
                            <p className="text-red-700 mb-4">{error || 'Something went wrong while loading courses.'}</p>
                            <Button 
                                onClick={() => dispatch(fetchAllCourses())}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Try Again
                            </Button>
                        </div>
                    </motion.div>
                ) : featuredCourses.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={animationVariants.container}
                    >
                        {featuredCourses.map((course, index) => (
                            <motion.div key={course._id} variants={animationVariants.fadeInUp}>
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                        <p className="text-gray-500">Try adjusting your search terms or browse all courses</p>
                    </motion.div>
                )}

                <motion.div 
                    className="text-center mt-12"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={animationVariants.fadeInUp}
                >
                    <Link to="/courses">
                        <Button size="lg" className="group bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg">
                            View All Courses
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

const WhyChooseUsSection = () => {
    const features = [
        { icon: Rocket, title: "Cutting-Edge Technology", description: "We use the latest frameworks, AI models, and development practices to deliver future-proof solutions.", color: "from-blue-500 to-cyan-500" },
        { icon: Target, title: "Client-Centric Approach", description: "Your success is our priority. We collaborate closely to understand and exceed your expectations.", color: "from-purple-500 to-pink-500" },
        { icon: Users, title: "Expert Team", description: "Our team consists of industry veterans with years of experience in both development and education.", color: "from-green-500 to-emerald-500" },
        { icon: CheckCircle, title: "Proven Track Record", description: "We have a history of delivering high-impact projects and successful learning outcomes.", color: "from-orange-500 to-red-500" },
    ];
    
    return (
        <section className="py-12 sm:py-16 lg:py-20 xl:py-32 bg-gradient-to-br from-white via-slate-50 to-blue-50">
            <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    <motion.div 
                        initial="hidden" 
                        whileInView="show" 
                        viewport={{ once: true, amount: 0.4 }} 
                        variants={animationVariants.container}
                        className="order-2 lg:order-1"
                    >
                        <motion.h2 
                            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-4 sm:mb-6 text-gray-900" 
                            variants={animationVariants.fadeInUp}
                        >
                            Why Choose Sariyah Tech?
                        </motion.h2>
                        <motion.p 
                            className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10" 
                            variants={animationVariants.fadeInUp}
                        >
                            We're more than a service provider; we're your dedicated technology partner, committed to innovation, excellence, and empowerment through both development and education.
                        </motion.p>
                        <div className="space-y-6 sm:space-y-8">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div 
                                        key={i} 
                                        className="flex items-start gap-3 sm:gap-4 group" 
                                        variants={animationVariants.fadeInUp}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className={`flex-shrink-0 bg-gradient-to-br ${feature.color} p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">{feature.title}</h3>
                                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="relative h-[300px] sm:h-[400px] lg:h-[500px] order-1 lg:order-2" 
                        initial="hidden" 
                        whileInView="show" 
                        viewport={{ once: true, amount: 0.5 }} 
                        variants={animationVariants.scaleIn}
                    >
                        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-2xl">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                            </div>
                            <pre className="text-xs sm:text-sm font-mono text-slate-400 overflow-x-auto">
                                <code>
                                    <span className="text-sky-400">import</span> &#123; <span className="text-yellow-400">SariyahTech</span> &#125; <span className="text-sky-400">from</span> <span className="text-green-400">'@sariyah/tech'</span>;<br /><br />
                                    <span className="text-sky-400">const</span> <span className="text-purple-400">project</span> = <span className="text-sky-400">new</span> <span className="text-yellow-400">SariyahTech</span>(&#123;<br />
                                    {'  '}<span className="text-red-400">type</span>: <span className="text-green-400">'AI Agent'</span>,<br />
                                    {'  '}<span className="text-red-400">features</span>: [ <span className="text-green-400">'automation'</span>, <span className="text-green-400">'ml'</span> ],<br />
                                    {'  '}<span className="text-red-400">timeline</span>: <span className="text-green-400">'4 weeks'</span><br />
                                    &#125;);<br /><br />
                                    <span className="text-purple-400">project</span>.<span className="text-yellow-400">deploy</span>();<br />
                                    <span className="text-slate-500">// Your business, now supercharged.</span>
                                </code>
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { 
            name: "Sarah Ahmed", 
            company: "CEO, TechStart BD", 
            text: "Sariyah Tech delivered an exceptional AI chatbot for our customer service. The team's expertise in both development and AI is unmatched. Our response time improved by 70%!", 
            avatar: "SA",
            rating: 5,
            color: "from-blue-500 to-cyan-500"
        },
        { 
            name: "Mohammad Rahman", 
            company: "CTO, Digital Solutions", 
            text: "The mobile app they developed exceeded all expectations. Clean code, beautiful UI, and delivered ahead of schedule. Plus, their course helped our team learn React Native!", 
            avatar: "MR",
            rating: 5,
            color: "from-purple-500 to-pink-500"
        },
        { 
            name: "Fatima Khan", 
            company: "Student, Web Development Course", 
            text: "The web development course was phenomenal! The instructor explained complex topics with such clarity. I landed my first developer job within 3 months of completing the course.", 
            avatar: "FK",
            rating: 5,
            color: "from-green-500 to-emerald-500"
        },
    ];
    
    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-purple-50">
            <div className="container px-4 max-w-7xl mx-auto">
                <motion.div 
                    className="text-center mb-16" 
                    initial="hidden" 
                    whileInView="show" 
                    viewport={{ once: true, amount: 0.5 }} 
                    variants={animationVariants.fadeInUp}
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-gray-900">
                        What Our Clients & Students Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        From Fortune 500 companies to ambitious learners, we deliver results that exceed expectations.
                    </p>
                </motion.div>
                
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8" 
                    initial="hidden" 
                    whileInView="show" 
                    viewport={{ once: true, amount: 0.3 }} 
                    variants={animationVariants.container}
                >
                    {testimonials.map((t, i) => (
                        <motion.div key={i} variants={animationVariants.fadeInUp}>
                            <Card className="h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                                <CardHeader className="flex flex-row items-center gap-4 p-6 relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                    <Avatar className="w-12 h-12 relative z-10">
                                        <AvatarFallback className={`bg-gradient-to-br ${t.color} text-white font-bold text-lg`}>
                                            {t.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="relative z-10">
                                        <CardTitle className="text-lg text-gray-900">{t.name}</CardTitle>
                                        <CardDescription className="text-gray-600">{t.company}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="flex items-center mb-4">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <blockquote className="text-gray-600 italic">
                                        "{t.text}"
                                    </blockquote>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const CTASection = () => {
    return (
        <section className="py-20 lg:py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
            {/* Ultra Vibrant Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* Floating elements */}
                <div className="absolute top-20 left-20 w-6 h-6 bg-cyan-400/60 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-40 right-32 w-4 h-4 bg-pink-400/60 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute bottom-32 left-40 w-5 h-5 bg-yellow-400/60 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
                <div className="absolute bottom-20 right-20 w-4 h-4 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>
            
            <div className="container px-4 max-w-7xl mx-auto relative z-10">
                <motion.div 
                    className="max-w-4xl mx-auto text-center text-white"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={animationVariants.container}
                >
                    <motion.h2 
                        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
                        variants={animationVariants.fadeInUp}
                    >
                        Ready to Transform Your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400">
                            Business or Career?
                        </span>
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
                        variants={animationVariants.fadeInUp}
                    >
                        Whether you need a custom software solution or want to learn cutting-edge technologies, 
                        we're here to help you succeed.
                    </motion.p>
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={animationVariants.fadeInUp}
                    >
                        <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group border-0">
                            Start Your Project
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                        <Link to="/courses">
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <BookOpen className="mr-2 h-5 w-5" />
                                Explore Courses
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
            <div className="container px-4 py-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={DarkLogo} alt="Sariyah Tech" style={{width: 50, height: 50}} />
                            <h3 className="text-2xl font-bold">
                                Sariyah Tech<span className="text-gray-400">.</span>
                            </h3>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Premier technology development and education company. We build the future and teach you how to build it too.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/sariyahtech" target="_blank" rel="noopener noreferrer">
                                <Facebook className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                            </a>
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                            <Youtube className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Services</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#" className="hover:text-primary transition-colors">Web Development</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Mobile Apps</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">AI Agents</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Custom Software</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Learning</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li><Link to="/courses" className="hover:text-primary transition-colors">All Courses</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Web Development</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Mobile Development</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">AI & Machine Learning</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Sariyah Tech. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const Home = () => {
    return (
        <div className="bg-white text-gray-900 font-sans antialiased min-h-screen">
            <main className="relative">
                <HeroSection />
                <ServicesSection />
                <StatsSection />
                <FeaturedCoursesSection />
                <WhyChooseUsSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;