"use client"
import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import Link from "next/link";
import { Menu, X } from 'lucide-react';

const LandingNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    'bg-white/50 backdrop-blur-md shadow-md',
                    scrolled ? 'py-2' : 'py-4'
                )}
            >
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            alt='logo'
                            src='/assets/logos/ejaar_logo_v4.svg'
                            className="w-40 md:w-52 h-auto"
                        />
                    </div>

                    {/* Desktop Navigation - hidden on mobile */}
                    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <Link href="/signin" className="p-1">
                            <Button className="bg-ejaar-700 hover:bg-ejaar-700 hover:shadow-xl text-sm lg:text-base">
                                Se connecter
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-ejaar-700 hover:bg-ejaar-700 hover:shadow-xl text-sm lg:text-base">
                                Commencer
                            </Button>
                        </Link>
                        <Link href="#simuler">
                            <Button className="bg-[#9d4833] hover:bg-[#b35e49] text-sm lg:text-base">
                                Simuler
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button className="bg-ejaar-800 hover:bg-ejaar-blueHover text-sm lg:text-base">
                                Parler à un expert
                            </Button>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button - hidden on desktop */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu - only appears when mobileMenuOpen is true */}
            {mobileMenuOpen && (
                <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg pt-20 pb-8 md:hidden">
                    <div className="container mx-auto px-4 flex flex-col space-y-4">
                        <Link
                            href="/signin"
                            className="w-full"
                            onClick={handleLinkClick}
                        >
                            <Button className="w-full bg-ejaar-700 hover:bg-ejaar-700 hover:shadow-xl">
                                Se connecter
                            </Button>
                        </Link>
                        <Link
                            href="/signup"
                            className="w-full"
                            onClick={handleLinkClick}
                        >
                            <Button className="w-full bg-ejaar-700 hover:bg-ejaar-700 hover:shadow-xl">
                                Commencer
                            </Button>
                        </Link>
                        <Link
                            href="#simuler"
                            className="w-full"
                            onClick={handleLinkClick}
                        >
                            <Button className="w-full bg-[#9d4833] hover:bg-[#b35e49]">
                                Simuler
                            </Button>
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full"
                            onClick={handleLinkClick}
                        >
                            <Button className="w-full bg-ejaar-800 hover:bg-ejaar-blueHover">
                                Parler à un expert
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default LandingNavbar;
