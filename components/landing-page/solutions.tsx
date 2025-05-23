'use client';

import { motion } from 'framer-motion';
import {EquipmentCard} from "@/components/landing-page/solutions/EquipmentCard";
import {LeasingCTA} from "@/components/landing-page/solutions/LeasingCTA";
import {ClientTypes} from "@/components/landing-page/solutions/ClientTypes";
import React from "react";
import {ArrowRight, Clock, CreditCard, Shield} from "lucide-react";
import {FeatureCard} from "@/components/landing-page/features";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

export function Solutions() {
    return (
        <section className="relative overflow-hidden bg-[#fcf5eb] py-8 sm:py-16 text-black">
            {/* Divider */}
            <div className="h-1 w-[200px] sm:w-[300px] bg-[#4a7971] mx-auto mt-4 sm:mt-8 mb-8 sm:mb-16"></div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold text-[#182e43]">
                        Tous vos équipements, une seule <span className="text-[#4a7971]">solution</span> de leasing
                    </h1>
                </div>

                {/* Equipment and Client Types Section */}
                <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 items-center">
                    {/* Equipment Cards */}
                    <div className="flex flex-col gap-4 sm:gap-8 w-full lg:w-auto lg:mt-16 items-center lg:border-ejaar-700 lg:ml-[10%]">
                        <EquipmentCard2
                            icon={<img src='/assets/icons/workstation.png' className="w-20 sm:w-32" alt="Workstation icon"/>}
                            type="green"
                            title="Workstations hautes performances"
                            description="Des stations de travail puissantes pour vos besoins professionnels"
                        />
                        <EquipmentCard2
                            icon={<img src='/assets/icons/servers.png' className="w-20 sm:w-32" alt="Servers icon"/>}
                            type="green"
                            title="Serveurs & réseaux sécurisés"
                            description="Infrastructure réseau robuste et sécurisée"
                            highlighted={true}
                        />
                        <EquipmentCard2
                            icon={<img src='/assets/icons/tablets.png' className="w-20 sm:w-32" alt="Tablets icon"/>}
                            type="green"
                            title="Flottes mobiles & tablettes"
                            description="Solutions mobiles pour votre équipe"
                        />
                    </div>

                    {/* Divider - Hidden on mobile */}
                    <div className="hidden lg:block w-1 h-[300px] bg-[#4a7971] my-auto mx-4 lg:mx-8"></div>

                    {/* Client Types */}
                    <div className="flex flex-col w-full lg:w-auto lg:mb-auto">
                        <h3 className="px-3 text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-8 text-[#182e43] font-bold leading-tight lg:leading-tight lato-bold">
                            Et pour tous types d&apos;acteurs
                        </h3>
                        <div className="z-10 flex flex-col relative">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 lg:gap-12 z-10">
                                <div className="flex gap-2 items-center text-lg sm:text-xl my-2 text-[#4a7971]">
                                    <span className="h-3 w-1 bg-[#4a7971]"></span> TPE/PME/ETI
                                </div>
                                <div className="flex gap-2 items-center text-lg sm:text-xl my-2 text-[#4a7971]">
                                    <div className="h-3 w-1 bg-[#4a7971]"></div>
                                    Professions libérales
                                </div>
                                <div className="flex gap-2 items-center text-lg sm:text-xl my-2 text-[#4a7971]">
                                    <div className="h-3 w-1 bg-[#4a7971]"></div>
                                    Auto entrepreneurs
                                </div>
                            </div>

                            <img
                                className="mt-4 sm:mt-8 w-full max-w-[600px] mx-auto"
                                src="/assets/images/img_6.png"
                                alt="illustration"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-1 w-[200px] sm:w-[300px] bg-[#9d4833] mx-auto my-12 sm:my-20"></div>

            {/* Partners Section */}
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-8 sm:mb-12 text-[#182e43] font-bold leading-tight lg:leading-tight lato-bold">
                    Partenaires revendeurs, <span className="text-[#9d4833]">vendez mieux, plus vite</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 items-center">
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center">
                        <img
                            src="/assets/images/img_9.png"
                            className="mt-8 sm:mt-20 w-full max-w-[700px] mx-auto"
                            alt="Partner illustration"
                        />
                        <Button
                            className="mt-8 sm:mt-12 mb-8 sm:mb-20 bg-[#9d4833] text-gray-50 hover:bg-[#b35e49] text-lg sm:text-xl sm:px-16 h-[50px] sm:h-[60px] mx-auto"
                        >
                            Découvrez plus sur notre plateforme
                            <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>

                        <div className="hidden sm:block relative">
                            <img
                                src="/assets/images/arrow_right_small.png"
                                width={70}
                                height={20}
                                className="absolute pulse-arrow -bottom-6 right-[-5%] z-20"
                                alt="Arrow indicator"
                            />
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-8">
                        <div className="space-y-4 sm:space-y-8 animate-fade-in">
                            <p className="text-lg sm:text-xl md:text-2xl text-justify text-[#344e69] lat-bold">
                                Avec Ejaar, chaque demande de devis devient une opportunité gagnée. Notre plateforme commerciale tout-en-un intègre génération de devis, validation de financement et suivi contractuel, pour fluidifier votre cycle de vente et accélérer la décision client
                            </p>
                        </div>

                        <div className="mt-4 sm:mt-8 sm:ml-0 lg:ml-14 space-y-6">
                            <FeatureCard
                                icon={<Clock size={20} className="sm:w-6 sm:h-6" />}
                                type="red"
                                title="Accélérez vos ventes, augmentez vos conversions"
                                description="Proposez une solution locative clé-en-main pour lever les freins budgétaires et conclure plus rapidement"
                            />
                            <FeatureCard
                                icon={<CreditCard size={20} className="sm:w-6 sm:h-6" />}
                                type="red"
                                title="Générez des devis en quelques clics"
                                description="Simulez des loyers adaptés au besoin client. Encouragez l'upsell avec des offres plus complètes, plus accessibles"
                                highlighted={true}
                            />
                            <FeatureCard
                                icon={<Shield size={20} className="sm:w-6 sm:h-6" />}
                                type="red"
                                title="Simplifiez votre cycle de vente"
                                description="Centralisez devis, validation et signature dans un seul parcours digital. Moins de frictions, plus d'efficacité commerciale"
                            />
                            <FeatureCard
                                icon={<Shield size={20} className="sm:w-6 sm:h-6" />}
                                type="red"
                                title="Suivez l'avancement de vos dossiers en temps réel"
                                description="Visualisez tous vos devis, ceux en cours de finalisation, validés ou transformés en bon de commande — pour une gestion fluide de votre activité"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export const EquipmentCard2 = ({
                                   icon,
                                   type='yellow',
                                   title,
                                   description,
                                   highlighted = false
                               }: {
    icon: React.ReactNode;
    title: string;
    type: string;
    description: string;
    highlighted?: boolean;
}) => {
    return (
        <div
            className={cn(`rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 transition-all duration-300
             hover:-translate-y-1 w-full sm:max-w-[600px]`,
                type === 'green' ? `hover:bg-[#e5eae9]`: `hover:bg-[#f7ecde]`
            )}
        >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
                {type === `green` && icon}
                <div className={cn(`cursor-default 
                    my-auto
                    rounded-lg
                    text-center
                    p-2 sm:p-4 w-full sm:max-w-[300px] text-gray-50
                    text-lg sm:text-2xl`,
                    title === `Serveurs & réseaux sécurisés` ? `mb-2 sm:mb-5` : ``,
                    type === 'green' ? `hover:bg-[#4a7971] bg-[#4a7971]`: `bg-[#deb679] hover:bg-[#deb679]`
                )}>
                    {title}
                </div>
            </div>
        </div>
    );
};
