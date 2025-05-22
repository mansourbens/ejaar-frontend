"use client"
import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import { Computer, Server, ArrowRight } from 'lucide-react';
import Link from "next/link";
import RentCalculator from "@/components/landing-page/rent-calculator";
import {Card} from "@/components/ui/card";

const LandingPage = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-[#fcf5eb]">
            {/* Background Elements */}

            {/* Grid pattern */}<div className="absolute inset-0 z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col space-y-8 animate-fade-in">

                        <h1 className="text-4xl text-[#182e43] md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                            Libérez votre trésorerie,  <span className="text-[#256aa3]">accélérez</span>   vos projets IT                       </h1>

                        <p className="text-2xl text-justify text-[#344e69] max-w-xl lat-bold">
                            Ejaar transforme vos achats d’équipements en loyers prévisibles. Obtenez un financement en moins de 48 h, sans immobiliser de cash ni complexité administrative.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/signin">
                                <Button className="bg-ejaar-800 hover:bg-ejaar-700 group text-base">
                                    Commencer <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <Button className="ejaar-btn ejaar-btn-outline text-base"
                                    onClick={handleFlip}
                                    variant="outline">
                                Simuler une location
                            </Button>
                        </div>
                    </div>

                    <div className="relative perspective mb-auto min-h-[500px]">
                        <div className={`relative w-full flip-card ${isFlipped ? 'flipped' : ''}`}>
                            <div className="flip-card-front rounded-2xl  p-1 shadow-xl">
                                <div className="absolute inset-0  rounded-2xl backdrop-blur-sm"></div>
                                    <img src='/assets/backgrounds/image_5.jpg' width={800} className="absolute left-0"/>
                            </div>

                            <div className="flip-card-back rounded-2xl p-1 shadow-xl">
                                <Card className=" m-auto bg-white/50 rounded-3xl hover:shadow-xl mb-16">
                                    <div className=" h-full rounded-3xl p-8">
                                        <RentCalculator onBack={handleFlip} />
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Éléments décoratifs */}
                    </div>
                </div>
            </div>
        </section>
    );
};

const HeroCard = ({
                      icon,
                      title,
                      description,
                      isAnimated = false,
                      delay = "0ms"
                  }: {
    icon: React.ReactNode,
    title: string,
    description: string,
    isAnimated?: boolean,
    delay?: string
}) => {
    return (
        <div
            className={`bg-white rounded-lg p-5 shadow-sm border border-gray-100 ${
                isAnimated ? 'animate-fade-in' : ''
            }`}
            style={{ animationDelay: delay }}
        >
            <div className="w-10 h-10 rounded-lg bg-ejaar-50 flex items-center justify-center mb-3">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
};

export default LandingPage;
