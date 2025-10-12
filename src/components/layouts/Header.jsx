// src/components/Header.jsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookMarked, LogOut, LayoutDashboard, User, ShieldCheck, Settings, BookCopy } from 'lucide-react';

// Your Redux logout action
import { logoutUser } from '@/features/auth/authSlice';


import DarkLogo from "../../assets/images/DarkLogo.png"
// A reusable Logo component for consistency
const Logo = () => (
    <Link to="/" className="flex items-center gap-2" style={{paddingLeft: 50}}>
        <img src={DarkLogo} style={{width: 50, height: 50}} />
    </Link>
);

// A helper to generate navigation links based on user role
const getRoleBasedNavLinks = (role) => {
    switch (role) {
        case 'student':
            return [{ to: "/dashboard/my-courses", text: "My Courses", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> }];
        case 'instructor':
            return [{ to: "/dashboard/instructor", text: "Instructor Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> }];
        case 'admin':
            return [
                { to: "/dashboard/instructor", text: "Manage Courses", icon: <BookCopy className="mr-2 h-4 w-4" /> },
                { to: "/admin/payments", text: "Manage Payments", icon: <ShieldCheck className="mr-2 h-4 w-4" /> },
                { to: "/admin/categories", text: "Manage Categories", icon: <Settings className="mr-2 h-4 w-4" /> },
            ];
        default:
            return [];
    }
};

const UserNav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser())
            .unwrap()
            .then(() => {
                toast.success('Logged out successfully');
                navigate('/login');
            })
            .catch((err) => {
                toast.error(err || 'Failed to log out');
            });
    };

    const userInitials = user.name.split(' ').map(n => n[0]).join('') || 'U';
    const roleLinks = getRoleBasedNavLinks(user.role);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/50"><AvatarImage src={user.avatarUrl} /><AvatarFallback>{userInitials}</AvatarFallback></Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roleLinks.map(link => (
                    <DropdownMenuItem key={link.to} asChild>
                        <Link to={link.to}>{link.icon}<span>{link.text}</span></Link>
                    </DropdownMenuItem>
                ))}
                {/* <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 h-4 w-4" /><span>Profile Settings</span></Link></DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const navLinkClass = ({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`;
    const roleLinks = isAuthenticated ? getRoleBasedNavLinks(user.role) : [];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                
                {/* --- DESKTOP NAVIGATION --- */}
                <div className="mr-4 hidden md:flex">
                    <Logo />
                    <nav className="flex items-center space-x-6 text-sm font-medium ml-6">
                        <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
                        {roleLinks.map(link => <NavLink key={link.to} to={link.to} className={navLinkClass}>{link.text}</NavLink>)}
                    </nav>
                </div>

                {/* --- MOBILE NAVIGATION (SHEET) --- */}
                <div className="md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button></SheetTrigger>
                        <SheetContent side="left" className="p-0 pt-6 w-72">
                            <div className="px-6 mb-4"><Logo /></div>
                            <div className="flex flex-col space-y-1 p-4">
                                <NavLink to="/courses" className={navLinkClass} onClick={() => setIsSheetOpen(false)}><Button variant="ghost" className="w-full justify-start text-base">Courses</Button></NavLink>
                                {roleLinks.map(link => (
                                    <NavLink key={link.to} to={link.to} className={navLinkClass} onClick={() => setIsSheetOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-base">{link.icon} {link.text}</Button>
                                    </NavLink>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {isAuthenticated ? (
                        <UserNav />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
                            <Button asChild><Link to="/register">Register</Link></Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;