"use client";

import React, { useState } from 'react';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useTheme } from 'next-themes';
import Sidebar from '@/components/sidebar/sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            <Sidebar />

            <div className="flex-1 flex flex-col lg:pl-64">
                <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6 text-gray-500" />
                        </button>
                        <div className="flex w-full">
                            <div className="flex items-center">
                                Bienvenue
                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.fullName || 'User'}
                </span>
                            </div>
                            <div className="flex ml-auto">
                                <button className="p-2 relative rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
