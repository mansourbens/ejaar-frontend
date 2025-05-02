"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from "next/image";
import Link from "next/link";

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

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-md py-2'
                    : 'bg-transparent py-4'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="text-2xl font-bold text-ejaar-800">
                        <Image alt='logo' src='/assets/logos/ejaar_logo_v2.png' width={150} height={40}/>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/signin">
                    <Button
                        variant="outline"
                        className="border-ejaar-700 text-ejaar-800 hover:bg-ejaar-50"
                    >
                        Se connecter
                    </Button>
                    </Link>
                    <Link href="/contact">
                    <Button className="bg-ejaar-800 text-white hover:bg-ejaar-700">
                        Contactez nous
                    </Button>
                    </Link>

                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-ejaar-800 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg rounded-b-lg px-4 py-5 absolute top-full left-0 right-0">
                    <nav className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-2 pt-2">
                            <Button
                                variant="outline"
                                className="w-full border-ejaar-700 text-ejaar-800 hover:bg-ejaar-50"
                            >
                                Se connecter
                            </Button>
                            <Button className="w-full bg-ejaar-800 text-white hover:bg-ejaar-700">
                                Contactez nous
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

const NavLinks = () => {
    const links = [
        { name: 'Products', href: '#products' },
        { name: 'Solutions', href: '#solutions' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Company', href: '#company' },
    ];

    return (
        <>
            {links.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    className="text-ejaar-900 hover:text-ejaar-600 font-medium transition-colors"
                >
                    {link.name}
                </a>
            ))}
        </>
    );
};

const NavLinksMobile = ({
                            setMobileMenuOpen
                        }: {
    setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const links = [
        { name: 'Produi', href: '#products' },
        { name: 'Solutions', href: '#solutions' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Company', href: '#company' },
    ];

    return (
        <>
            {links.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    className="text-ejaar-900 hover:text-ejaar-600 font-medium transition-colors px-1 py-2 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {link.name}
                </a>
            ))}
        </>
    );
};

const Logo = () => (
    <div className="flex items-center">
        <svg
            width="34"
            height="34"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44Z"
                fill="#1E3A8A"
            />
            <path
                d="M14 16H30V18H14V16Z"
                fill="white"
            />
            <path
                d="M14 21H30V23H14V21Z"
                fill="white"
            />
            <path
                d="M14 26H30V28H14V26Z"
                fill="white"
            />
        </svg>
        <span>EJAAR</span>
    </div>
);

export default LandingNavbar;
