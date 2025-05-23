"use client"
import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import RentCalculator from "@/components/landing-page/rent-calculator";
import {Card} from "@/components/ui/card";

const LandingPage = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <section className="relative pt-16 md:pt-24 lg:pt-32 pb-12 md:pb-20 overflow-hidden bg-[#fcf5eb]">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    {/* Text Content */}
                    <div className="flex flex-col space-y-6 md:space-y-8 animate-fade-in w-full lg:w-1/2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-[#182e43] font-bold leading-tight lg:leading-tight">
                            Libérez votre trésorerie, <span className="text-[#256aa3]">accélérez</span> vos projets IT
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-justify text-[#344e69] max-w-xl">
                            Ejaar transforme vos achats d'équipements en loyers prévisibles. Obtenez un financement en moins de 48 h, sans immobiliser de cash ni complexité administrative.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link href="/signin" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto bg-ejaar-800 hover:bg-ejaar-700 group text-sm sm:text-base">
                                    Commencer <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <Button
                                className="w-full sm:w-auto ejaar-btn ejaar-btn-outline text-sm sm:text-base"
                                onClick={handleFlip}
                                variant="outline"
                            >
                                Simuler une location
                            </Button>
                        </div>
                    </div>

                    {/* Flip Card Container */}
                    <div className="relative w-full lg:w-1/2 h-[650px] sm:h-[650px] md:h-[550px]">
                        <div
                            className={`relative w-full h-full transition-all duration-700 ease-in-out transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                            style={{
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                                height: '100%'
                            }}
                        >
                            {/* Front Card */}
                            <div
                                className="absolute w-full h-full  backface-hidden"
                                style={{
                                    backfaceVisibility: 'hidden',
                                    height: '100%'
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/assets/backgrounds/image_5.jpg"
                                        alt="IT Equipment Leasing"
                                        fill
                                        className="object-cover"
                                        priority
                                        quality={80}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                    />
                                </div>
                            </div>

                            {/* Back Card */}
                            <div
                                className="absolute w-full h-full rounded-2xl shadow-xl backface-hidden"
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    height: '100%'
                                }}
                            >
                                <Card className="h-full bg-white/50 rounded-2xl hover:shadow-xl">
                                    <div className="h-full rounded-2xl p-4 sm:p-6 md:p-8 overflow-y-auto">
                                        <RentCalculator onBack={handleFlip} />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingPage;
