'use client';

import { motion } from 'framer-motion';
import {EquipmentCard} from "@/components/landing-page/solutions/EquipmentCard";
import {LeasingCTA} from "@/components/landing-page/solutions/LeasingCTA";
import {ClientTypes} from "@/components/landing-page/solutions/ClientTypes";
import React from "react";
import {Clock, CreditCard, Shield} from "lucide-react";
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
                <h1 className="text-4xl text-center mb-8 text-[#182e43] md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                    Fournisseurs, transformez chaque demande de devis en <span className="text-[#9d4833]">opportunité</span> conclue
                </h1>
                <div className="grid lg:grid-cols-2 items-center">
                    <div className="justify-center flex self-start">
                        <img src='/assets/images/img_9.png' width={700}/>
                    </div>
                    <div className="flex flex-col gap-8">


                        <div className="relative perspective mb-auto">
                            <div className="flex flex-col">
                                <div className="flex flex-col space-y-8 animate-fade-in">


                                    <p className="text-2xl text-justify text-[#344e69] lat-bold">
                                        Ejaar vous offre une plateforme commerciale tout‑en‑un : elle combine génération de devis, validation de financement et suivi contractuel pour dynamiser vos ventes d’équipements.
                                    </p>

                                </div>
                                <div className="grid grid-cols-2">
                                    <FeatureCard
                                        icon={<Clock/>}
                                        type="red"
                                        title="Tunnel de conversion optimisé"
                                        description="Devis, approbation de financement et service connexe sur une même interface"
                                    />
                                    <FeatureCard
                                        icon={<CreditCard/>}
                                        type="red"
                                        title="Financement pour vos clients"
                                        description="Solutions locatives adaptées qui lèvent le frein budgétaire et accélèrent la décision d’achat"
                                        highlighted={true}
                                    />
                                    <FeatureCard
                                        icon={<Shield/>}
                                        type="red"
                                        title="Outil d’upsell intelligent"
                                        description="Recommandations automatiques de renouvellement ou d’options de maintenance pour maximiser la valeur par client"
                                    />
                                    <FeatureCard
                                        icon={<Shield/>}
                                        type="red"
                                        title="Support en un clic"
                                        description="Assistance technique et commerciale centralisée afin de sécuriser chaque étape du cycle de vente"
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
