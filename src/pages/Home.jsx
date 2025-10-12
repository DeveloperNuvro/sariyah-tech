// src/pages/LandingPage.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Lucide React Icons
import { Code, Bot, Smartphone, Globe, BookOpen, Star, Rocket, Users, Target, Terminal, Briefcase, PlayCircle, ChevronDown, Quote, ArrowRight, CheckCircle } from 'lucide-react';

// Your Redux Action
import { fetchAllCourses } from '../features/courses/courseSlice';
import { Link } from 'react-router-dom';

// Reusable Animation Variants
const animationVariants = {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
    fadeInUp: { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } },
    scaleIn: { hidden: { scale: 0.95, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }
};

// --- SECTION COMPONENTS ---

const HeroSection = () => {
    return (
        <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* IMPROVED BACKGROUND for high contrast and visual interest */}
            <div className="absolute inset-0 z-0 bg-background">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='hsl(var(--border))'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
                    }}
                ></div>
            </div>

            <motion.div
                className="container relative z-10 text-center px-4"
                initial="hidden"
                animate="show"
                variants={animationVariants.container}
            >
                <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-50 to-slate-400"
                    variants={animationVariants.fadeInUp}
                >
                    Build The Future, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Today.</span>
                </motion.h1>
                <motion.p
                    className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
                    variants={animationVariants.fadeInUp}
                >
                    Sariyah Tech provides cutting-edge software solutions, AI-powered agents, and expert-led courses to propel your business into the next generation of technology.
                </motion.p>
                <motion.div
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                    variants={animationVariants.fadeInUp}
                >
                    <Button size="lg" className="group transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))]">
                        Explore Services <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                    <Link to={'/courses'} >
                        <Button size="lg" className='cursor-pointer' variant="outline">View Courses</Button>
                    </Link>
                </motion.div>
            </motion.div>
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <ChevronDown className="w-8 h-8 text-muted-foreground/50" />
            </motion.div>
        </section>
    );
};

const ServicesSection = () => {
    const services = [
        { icon: Globe, title: "Website Development", description: "Crafting high-performance websites that captivate and convert." },
        { icon: Code, title: "Software Development", description: "Bespoke software solutions tailored to solve your complex business challenges." },
        { icon: Bot, title: "AI Agent Development", description: "Building intelligent agents to automate tasks and enhance user experiences." },
        { icon: Smartphone, title: "App Development", description: "Developing intuitive and powerful mobile applications for iOS and Android." },
    ];
    return (
        <section id="services" className="py-20 lg:py-32 bg-muted">
            <div className="container px-4">
                <motion.div className="text-center mb-16" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={animationVariants.fadeInUp}>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Our Core Services</h2>
                    <p className="mt-4 max-w-xl mx-auto text-muted-foreground">We turn complex ideas into brilliant technology.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={animationVariants.container}>
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div key={index} variants={animationVariants.fadeInUp}>
                                <Card className="group h-full text-center bg-background border transition-all duration-300 hover:border-primary hover:-translate-y-2">
                                    <CardHeader className="items-center">
                                        <div className="p-4 bg-muted rounded-full transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110">
                                            <Icon className="w-8 h-8 text-primary" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="mb-2">{service.title}</CardTitle>
                                        <p className="text-muted-foreground text-sm">{service.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    );
};



const WhyChooseUsSection = () => {
    const features = [
        { icon: Rocket, title: "Cutting-Edge Technology", description: "We leverage the latest frameworks and AI models to deliver future-proof solutions." },
        { icon: Target, title: "Client-Centric Approach", description: "Your success is our priority. We collaborate closely to understand and meet your goals." },
        { icon: Users, title: "Expert Team", description: "Our team consists of vetted professionals with years of industry experience and a passion for teaching." },
        { icon: CheckCircle, title: "Proven Track Record", description: "We have a history of delivering high-impact projects and successful learning outcomes." },
    ];
    return (
        <section id="why-choose-us" className="py-20 lg:py-32 bg-muted overflow-hidden">
            <div className="container px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={animationVariants.container}>
                        <motion.h2 className="text-3xl md:text-4xl font-bold tracking-tighter" variants={animationVariants.fadeInUp}>Why Partner with Sariyah Tech?</motion.h2>
                        <motion.p className="mt-4 text-muted-foreground" variants={animationVariants.fadeInUp}>We're more than a service provider; we're your dedicated technology partner, committed to innovation, excellence, and empowerment through education.</motion.p>
                        <div className="mt-10 space-y-8">{features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (<motion.div key={i} className="flex items-start gap-4" variants={animationVariants.fadeInUp}><div className="flex-shrink-0 bg-background p-3 rounded-full border"><Icon className="w-6 h-6 text-primary" /></div><div><h3 className="font-semibold text-lg">{feature.title}</h3><p className="text-sm text-muted-foreground mt-1">{feature.description}</p></div></motion.div>)
                        })}</div>
                    </motion.div>
                    <motion.div className="relative h-[500px]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={animationVariants.scaleIn}>
                        <div className="relative w-full h-full bg-slate-900 rounded-lg border border-primary/20 p-4 shadow-2xl shadow-primary/10">
                            <div className="flex items-center gap-2 mb-4"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                            <pre><code className="text-sm font-mono text-slate-400">
                                <span className="text-sky-400">import</span> &#123; <span className="text-yellow-400">Sariyah TechAgent</span> &#125; <span className="text-sky-400">from</span> <span className="text-green-400">'@Sariyah Tech/ai'</span>;<br /><br />
                                <span className="text-sky-400">const</span> <span className="text-purple-400">newAgent</span> = <span className="text-sky-400">new</span> <span className="text-yellow-400">Sariyah TechAgent</span>(&#123;<br />
                                {'  '}<span className="text-red-400">goal</span>: <span className="text-green-400">'Automate customer support'</span>,<br />
                                {'  '}<span className="text-red-400">skills</span>: [ <span className="text-green-400">'natural_language'</span>, <span className="text-green-400">'database_query'</span> ],<br />
                                &#125;);<br /><br />
                                <span className="text-purple-400">newAgent</span>.<span className="text-yellow-400">deploy</span>();<br />
                                <span className="text-slate-500">// Your business, now supercharged.</span>
                            </code></pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { name: "Sarah L.", company: "CEO, Innovate Inc.", text: "Sariyah Tech transformed our digital presence. Their team's expertise in both development and AI is unparalleled. The results exceeded all our expectations!", avatar: "SL" },
        { name: "Michael B.", company: "CTO, Future Systems", text: "The custom software they developed streamlined our operations by 40%. It's robust, scalable, and was delivered ahead of schedule. Highly recommended.", avatar: "MB" },
        { name: "Emily C.", company: "Student, AI Mastery Course", text: "The AI course was phenomenal. The instructor explained complex topics with such clarity. I feel confident building my own AI agents now!", avatar: "EC" },
    ];
    return (
        <section id="testimonials" className="py-20 lg:py-32 bg-background">
            <div className="container px-4">
                <motion.div className="text-center mb-16" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={animationVariants.fadeInUp}>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Trusted by Innovators</h2>
                    <p className="mt-4 max-w-xl mx-auto text-muted-foreground">From Fortune 500 companies to ambitious learners, we deliver results.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={animationVariants.container}>
                    {testimonials.map((t, i) => (
                        <motion.div key={i} variants={animationVariants.fadeInUp}>
                            <Card className="h-full bg-muted border flex flex-col relative">
                                <CardHeader className="flex flex-row items-center gap-4 p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-lg">{t.avatar}</div>
                                    <div><CardTitle>{t.name}</CardTitle><CardDescription>{t.company}</CardDescription></div>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 flex-grow">
                                    <div className="flex items-center mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
                                    <blockquote className="text-muted-foreground italic border-l-2 border-primary pl-4">"{t.text}"</blockquote>
                                </CardContent>
                                <Quote className="absolute top-0 right-0 w-32 h-32 text-border -translate-y-4 translate-x-4" />
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const ContactSection = () => {
    return (
        <section id="contact" className="py-20 lg:py-32 bg-muted">
            <div className="container px-4">
                <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={animationVariants.fadeInUp}>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Let's Build Something Amazing</h2>
                    <p className="mt-4 text-muted-foreground">Have a project in mind or just want to learn more? We'd love to hear from you.</p>
                </motion.div>
                <motion.div className="mt-12 max-w-xl mx-auto" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={animationVariants.scaleIn}>
                    <Card className="bg-background border">
                        <CardHeader><CardTitle>Contact Us</CardTitle><CardDescription>Fill out the form and we'll get back to you shortly.</CardDescription></CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><Input placeholder="Your Name" /><Input type="email" placeholder="Your Email" /></div>
                                <Textarea placeholder="Tell us about your project or inquiry..." rows={6} />
                                <Button type="submit" size="lg" className="w-full group transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--accent))]">
                                    Send Message <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="border-t">
            <div className="container px-4 py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p className="font-bold">Sariyah<span className="text-primary">Tech</span></p>
                <p className="order-first sm:order-none">&copy; {new Date().getFullYear()} Sariyah Tech. All rights reserved.</p>
                <div className="flex gap-6 mt-4 sm:mt-0"><a href="#" className="hover:text-primary transition-colors">Privacy</a><a href="#" className="hover:text-primary transition-colors">Terms</a></div>
            </div>
        </footer>
    );
}

const Home = () => {
    return (
        <div className="bg-background text-foreground font-sans antialiased">
            <main>
                <HeroSection />
                <ServicesSection />
                <WhyChooseUsSection />
                <TestimonialsSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;