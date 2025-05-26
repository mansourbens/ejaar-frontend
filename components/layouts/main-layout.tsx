"use client";

import React, { useState } from 'react';
import {
    Menu,
    Sun,
    Moon,
    Bell,
    FileTextIcon,
    FoldersIcon,
    PlusCircleIcon,
    User2Icon,
    MoreVertical,
    FileDown, CircleXIcon, CheckCircle2Icon, LogOutIcon, Settings2Icon, CogIcon
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useTheme } from 'next-themes';
import Sidebar from '@/components/sidebar/sidebar';
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {UserRole} from "@/lib/utils";
import {QuotationStatusEnum} from "@/lib/mock-data";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex h-screen bg-ejaar-beige ">
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-10 bg-white/50 backdrop-blur-md shadow-md py-2">
                    <div className="flex items-center justify-between h-16 pr-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-8">
                            <Link href="/" className="inline-flex items-center w-full">
                                <img alt='logo' src='/assets/logos/ejaar_logo_v4.svg' className="mx-auto" width={140}/>
                            </Link>
                        </div>
                        <button
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6 text-gray-500" />
                        </button>
                        <div className="flex w-full">
                            <nav className="ml-auto items-end flex space-x-8 ">
                                <Link href="/quotations" className="overflow-auto">
                                    <Button className="bg-ejaar-700 hover:bg-ejaar-700 hover:shadow-xl group text-base">
                                        <FileTextIcon className="h-5 w-5 mr-3" />
                                        {user?.role.name === UserRole.CLIENT && `Mes` } Devis
                                    </Button>
                                </Link>
                                <Link href="/folders">
                                    <Button className="bg-ejaar-700 hover:bg-ejaar-700 hover:shadow-xl group text-base">
                                        <FoldersIcon className="h-5 w-5 mr-3" />
                                        {user?.role.name === UserRole.CLIENT && `Mes` } Dossiers
                                    </Button>
                                </Link>
                                {user?.role.name === UserRole.SUPER_ADMIN && <Link href="/settings">
                                    <Button className="bg-ejaar-700 hover:bg-ejaar-700 hover:shadow-xl group text-base">
                                        <CogIcon className="h-5 w-5 mr-3" />
                                        Paramétrage
                                    </Button>
                                </Link>}

                                {user?.role.name === UserRole.CLIENT && <Link href="/quotations/new">
                                    <Button className="bg-[#9d4833] hover:bg-[#b35e49] group text-base">
                                        <PlusCircleIcon className="h-5 w-5 mr-3" />
                                        Nouveau devis
                                    </Button>
                                </Link>}
                            </nav>
                            <div className="divider-ejaar h-8 w-0.5 bg-[#4a7971] my-auto mx-4"></div>
                            <div className="flex ml-2">
                                <button className="p-2 relative rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                            </div>
                            <div className="flex ml-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 relative rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <User2Icon className="h-5 w-5" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={logout} className="text-red-500">
                                            <LogOutIcon className="w-4 h-4 mr-2" />
                                            Se déconnecter
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
                <div className="bg-ejaar-700 h-10 w-full"></div>
            </div>
        </div>
    );
}
