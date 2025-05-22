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
        <section className="relative overflow-hidden bg-[#fcf5eb] py-16 text-black">
            <div className="divider-ejaar h-1 w-[300px] bg-[#4a7971] mx-auto mt-8 mb-16"></div>
            <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-8 text-center">
                                <h1 className="text-4xl text-[#182e43] md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">

                                    Tous vos équipements, une seule <span className="text-[#4a7971]">solution</span> de leasing

                                </h1>
                        </div>
                <div className="flex gap-16 items-center">
                    <div className="flex flex-col gap-2 mt-16 items-center border-ejaar-700 ml-[17%]">
                        <EquipmentCard2
                            icon={<img src='/assets/icons/workstation.png' width={128}/>}
                            type="green"
                            title="Workstations hautes performances"
                            description="Des stations de travail puissantes pour vos besoins professionnels"
                        />
                        <EquipmentCard2
                            icon={<img src='/assets/icons/servers.png' width={128}/>}
                            type="green"
                            title="Serveurs & réseaux sécurisés"
                            description="Infrastructure réseau robuste et sécurisée"
                            highlighted={true}
                        />
                        <EquipmentCard2
                            icon={<img src='/assets/icons/tablets.png' width={128}/>}
                            type="green"
                            title="Flottes mobiles & tablettes"
                            description="Solutions mobiles pour votre équipe"
                        />
                    </div>
                    <div className="divider-ejaar w-1 h-[300px] bg-[#4a7971] my-auto mx-8"></div>
                    <div className="flex relative flex-col mb-auto">
                        <h3 className="px-3 text-5xl mb-auto text-[#182e43] font-bold leading-tight lg:leading-tight lato-bold">
                            Et pour tous types d&apos;acteurs
                        </h3>
                        <div className="z-10 flex flex-col relative">
                            <div className="flex gap-12 z-10">
                                <div className="mt-2 flex gap-2 items-center text-xl my-4 text-[#4a7971]">
                                    <span className="h-3 w-1  bg-[#4a7971]"></span> TPE/PME/ETI
                                </div>
                                <div className="mt-2 flex gap-2 items-center  text-xl my-4 text-[#4a7971]">
                                    <div className="h-3 w-1 bg-[#4a7971]"></div>
                                    Professions libérales
                                </div>
                                <div className="mt-2 flex gap-2 items-center   text-xl my-4 text-[#4a7971]">
                                    <div className="h-3 w-1 bg-[#4a7971]"></div>
                                    Auto entrepreneurs
                                </div>
                            </div>

                            <img
                                className="  z-0"
                                src="/assets/images/img_6.png"
                                width={600}
                                alt="illustration"
                            />
                        </div>

                    </div>



                </div>
            </div>
            <div className="divider-ejaar h-1 w-[300px] bg-[#9d4833] mx-auto my-20"></div>
            <div className="container mx-auto px-2 relative z-10">
                <h1 className="text-4xl text-center mb-12 text-[#182e43] md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                    Partenaires revendeurs, <span className="text-[#9d4833]">vendez mieux, plus vite</span>
                </h1>
                <div className="grid lg:grid-cols-2 items-center">
                    <div className=" flex flex-col self-start my-auto relative">
                        <img src='/assets/images/img_9.png' className="mt-20" width={700}/>
                        <Button size="lg" className="mt-12 mb-20 bg-[#9d4833] text-gray-50 hover:bg-[#b35e49] text-2xl px-16  h-[60px]">
                            Découvrez plus sur notre plateforme
                            <ArrowRight className="ml-2 w-6 h-6"/>
                        </Button>
                        <div>
                            <img src='/assets/images/arrow_right_small.png' width={70} height={20} className="absolute pulse-arrow bottom-[13%] right-[-5%] z-20" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">


                        <div className="relative perspective mb-auto">
                            <div className="flex flex-col">
                                <div className="flex flex-col space-y-8 animate-fade-in">


                                    <p className="text-2xl text-justify text-[#344e69] lat-bold">
                                        Avec Ejaar, chaque demande de devis devient une opportunité gagnée. Notre plateforme commerciale tout-en-un intègre génération de devis, validation de financement et suivi contractuel, pour fluidifier votre cycle de vente et accélérer la décision client                                    </p>

                                </div>
                                <div className="flex flex-col ml-28 mt-4">
                                    <FeatureCard
                                        icon={<Clock/>}
                                        type="red"
                                        title="Accélérez vos ventes, augmentez vos conversions"
                                        description="Proposez une solution locative clé-en-main pour lever les freins budgétaires et conclure plus rapidement"
                                    />
                                    <FeatureCard
                                        icon={<CreditCard/>}
                                        type="red"
                                        title="Générez des devis en quelques clics"
                                        description="Simulez des loyers adaptés au besoin client. Encouragez l’upsell avec des offres plus complètes, plus accessibles"
                                        highlighted={true}
                                    />
                                    <FeatureCard
                                        icon={<Shield/>}
                                        type="red"
                                        title="Simplifiez votre cycle de vente"
                                        description="Centralisez devis, validation et signature dans un seul parcours digital. Moins de frictions, plus d’efficacité commerciale"
                                    />
                                    <FeatureCard
                                        icon={<Shield/>}
                                        type="red"
                                        title="Suivez l’avancement de vos dossiers en temps réel"
                                        description="Visualisez tous vos devis, ceux en cours de finalisation, validés ou transformés en bon de commande — pour une gestion fluide de votre activité"
                                    />
                                </div>
                            </div>

                            {/*<ProgressStepBar currentStep={currentStep} />*/}

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
            className={cn(`rounded-xl px-8 py-2 transition-all duration-300
             hover:-translate-y-1 max-w-[600px]`,
                type === 'green' ? `hover:bg-[#e5eae9]`: `hover:bg-[#f7ecde]`
            )}
        >
            <div className="flex gap-8">
                {type === `green` &&
                    <>
                        {icon}
                    </>}
                <div className={cn(` cursor-default 
                my-auto
                rounded-lg
                text-center
                p-4 max-w-[300px] text-gray-50
             group text-2xl mb-2`,
                    title === `Serveurs & réseaux sécurisés` ? `mb-5` : ``,
                    type === 'green' ? `hover:bg-[#4a7971] bg-[#4a7971]`: `bg-[#deb679] hover:bg-[#deb679]`
                )}>
                    {title}
                </div>
            </div>

        </div>
    );
};
