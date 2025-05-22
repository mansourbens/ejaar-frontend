
import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from "next/image";

const LandingFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#182e43] pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="flex gap-8 mb-16">
                    {/* Company Info */}
                    <div className="w-2/5">
                        <div className="flex items-center mb-6">
                            <Image alt='logo' src='/assets/logos/ejaar_logo_v5.svg' width={150} height={40}/>

                        </div>
                        <p className="text-white mb-6 text-justify">
                            Platforme de solution de leasing pour matériel informatique, permettant aux entreprises
                            d'avoir les meilleurs offres de <span className="italic">Device-As-A-Service</span>
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <MapPin className="w-8 h-8 text-[#fcf5eb] mr-3" />
                                <span className="text-white">47, RUE AIT   OURIR, RESID. NASSIM JASSIM, APPT. N° 36 – CASABLANCA</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 text-[#fcf5eb] mr-3" />
                                <span className="text-white">+212 6 00 95 39 37</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 text-white mr-3" />
                                <a href="mailto:info@ejaar.com" className="text-white hover:text-blue-400">info@ejaar.com</a>
                            </div>
                        </div>
                    </div>


                    {/* Newsletter */}
                    <div className="ml-auto ml-[272px]">
                        <div className="mt-6">
                            <div className="grid grid-cols-3 text-white min-w-3xl gap-y-[20px] gap-x-[260px] my-8 grid-rows-4">
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">À propos</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Centre d'aide</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Conditions d'utilisation</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Carrières</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Contactez-nous</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Politique de confidentialité</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Presse</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">FAQ</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Politique relative aux cookies</div>
                                <div className="min-w-[220px] hover:text-ejaar-blueHover cursor-pointer">Blog</div>

                            </div>
                            <h4 className="text-sm font-semibold uppercase text-white mb-3">Suivez nous</h4>
                            <div className="flex space-x-4">
                                {[ 'linkedin'].map((social) => (
                                    <a
                                        key={social}
                                        href={`https://${social}.com`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-ejaar-800 hover:bg-ejaar-800 hover:text-white transition-colors"
                                    >
                                        <span className="sr-only">{social}</span>
                                        <SocialIcon name={social} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-white text-sm">
                        © {currentYear} EJAAR. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ name }: { name: string }) => {
    switch (name) {
        case 'facebook':
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
            );
        case 'twitter':
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
            );
        case 'instagram':
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            );
        case 'linkedin':
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                </svg>
            );
        default:
            return null;
    }
};

export default LandingFooter;
