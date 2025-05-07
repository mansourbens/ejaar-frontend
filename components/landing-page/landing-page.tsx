"use client"
import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import { Computer, Server, ArrowRight } from 'lucide-react';
import Link from "next/link";
import RentCalculator from "@/components/landing-page/rent-calculator";

const LandingPage = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="blue-blur-circle w-96 h-96 left-[-10%] top-[-10%]"></div>
                <div className="blue-blur-circle w-80 h-80 right-[-5%] bottom-[-5%]"></div>
            </div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(224,231,255,.2)_0.1px,transparent_0.1px),linear-gradient(90deg,rgba(224,231,255,.2)_0.1px,transparent_0.1px)] bg-[size:2rem_2rem] z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col space-y-8 animate-fade-in">

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                            Boostez votre entreprise avec des solutions matérielles <span className="gradient-text">modernes</span>                        </h1>

                        <p className="text-lg text-gray-700 max-w-xl lato-regular">
                            EJAAR propose des solutions de location de matériel flexibles et économiques, adaptées aux besoins de votre entreprise, avec un déploiement sans accroc et un accompagnement continu.
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
                            {/* Front side - Hardware cards */}
                            <div className="flip-card-front rounded-2xl  p-1 shadow-xl">
                                <div className="absolute inset-0 bg-white/40 rounded-2xl backdrop-blur-sm"></div>
                                <div className="relative rounded-xl bg-white/70 backdrop-blur-sm p-8 shadow-inner">
                                    <div className="grid grid-cols-2 gap-4">
                                        <HeroCard
                                            icon={<Computer className="text-ejaar-700" />}
                                            title="Workstations"
                                            description="Stations de travail haute performance pour des applications exigeantes."
                                            isAnimated={true}
                                        />
                                        <HeroCard
                                            icon={<Server className="text-ejaar-700" />}
                                            title="Serveurs"
                                            description="Serveurs de niveau entreprise avec des configurations flexibles."
                                            isAnimated={true}
                                            delay="200ms"
                                        />
                                        <HeroCard
                                            icon={
                                                <svg className="text-ejaar-700 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 4V16H4V4H20ZM20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
                                                    <path d="M20 20H4V22H20V20Z" fill="currentColor" />
                                                    <path d="M12 6.75C11.31 6.75 10.75 7.31 10.75 8C10.75 8.69 11.31 9.25 12 9.25C12.69 9.25 13.25 8.69 13.25 8C13.25 7.31 12.69 6.75 12 6.75Z" fill="currentColor" />
                                                </svg>
                                            }
                                            title="Équipements réseau"
                                            description="Routeurs, commutateurs et points d’accès pour une connectivité fiable."
                                            isAnimated={true}
                                            delay="300ms"
                                        />
                                        <HeroCard
                                            icon={
                                                <svg className="text-ejaar-700 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 2H6C4.89 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z" fill="currentColor" />
                                                    <path d="M12 18C12.55 18 13 17.55 13 17C13 16.45 12.55 16 12 16C11.45 16 11 16.45 11 17C11 17.55 11.45 18 12 18Z" fill="currentColor" />
                                                </svg>
                                            }
                                            title="Appareils mobiles"
                                            description="Smartphones et tablettes pour une main-d’œuvre mobile."
                                            isAnimated={true}
                                            delay="400ms"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Back side - Calculator form */}
                            <div className="flip-card-back rounded-2xl p-1 shadow-xl">
                                <div className="absolute inset-0 bg-white/40 rounded-2xl backdrop-blur-sm"></div>
                                <div className="relative h-full rounded-xl bg-white/70 backdrop-blur-sm p-8 shadow-inner">
                                    <RentCalculator onBack={handleFlip} />
                                </div>
                            </div>
                        </div>

                        {/* Éléments décoratifs */}
                        <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-ejaar-800/10 rounded-full blur-2xl"></div>
                        <div className="absolute -left-8 -top-8 w-20 h-20 bg-ejaar-400/20 rounded-full blur-xl"></div>
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
