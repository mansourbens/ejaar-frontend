import React from 'react';
import {Clock, Shield, ArrowRight, CreditCard} from 'lucide-react';
import Process from "@/components/landing-page/process";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Link from "next/link";

const Features = () => {
    return (
        <section id="features" className="py-10 bg-[#fcf5eb]">
            <div className="h-1 w-[300px] bg-[#4a7971] mx-auto mb-16"></div>
            <div className="container mx-auto px-4">
                <Process></Process>
                <div className="h-1 w-[300px] bg-[#182e43] mx-auto mb-16"></div>
                <div className="container mx-auto px-2 relative z-10">
                    <div className="grid lg:grid-cols-2 items-center">
                        <div className="justify-center flex">
                            <img src='/assets/images/img_5.png' width={400}/>
                        </div>
                        <div className="flex flex-col gap-8">


                            <div className="relative perspective mb-auto min-h-[500px]">
                                <div className="flex flex-col">
                                    <div className="flex flex-col space-y-8 animate-fade-in">

                                        <h1 className="text-4xl text-[#182e43] md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                                            Pourquoi choisir <span className="text-[#256aa3]">Ejaar</span> pour la
                                            location de matériel ?
                                        </h1>
                                        <p className="text-2xl text-justify text-[#344e69] max-w-xl lat-bold">
                                            Nous combinons du matériel de pointe avec des options de location flexibles
                                            pour faire avancer votre entreprise.</p>

                                    </div>
                                    <div className="grid grid-rows-3">
                                        <FeatureCard
                                            icon={<Clock/>}
                                            title="Validation en moins de 48 h"
                                            description="Notre workflow digital, orchestrant fournisseurs et partenaires bancaires, valide vos financements sous 48h, assurant un parcours de leasing fluide et sécurisé."
                                        />
                                        <FeatureCard
                                            icon={<CreditCard/>}
                                            title="Financement flexible"
                                            description="Transformez vos investissements IT en charges opérationnelles prévisibles grâce à des plans de loyers sur‑mesure parfaitement calibrés à votre capacité budgétaire."
                                            highlighted={true}
                                        />
                                        <FeatureCard
                                            icon={<Shield/>}
                                            title="Support complet"
                                            description="Appuyez‑vous sur un support 24/7, une maintenance proactive, des garanties étendues et une assurance tous risques intégrée."
                                        />
                                    </div>
                                </div>

                                {/*<ProgressStepBar currentStep={currentStep} />*/}

                            </div>
                        </div>
                    </div>
                </div>


                <div className="divider-ejaar h-1 w-[300px] bg-[#9d4632] mx-auto mt-16"></div>

                {/* Feature Grid */}
                <div className="mt-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="mb-8">
                                <h1 className="text-4xl text-[#182e43] md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                                    Contrôlez <span className="text-[#256aa3]">facilement</span>  vos dossiers de devis
                                </h1>
                                <p className="text-2xl text-justify text-[#344e69] max-w-xl lat-bold">
                                    Notre plateforme intuitive vous permet de suivre vos dossiers en temps réel, depuis
                                    la demande de devis jusqu’à la signature du contrat, avec une validation fluide par
                                    les banques.
                                </p>
                                <div className="mt-8">
                                    <Link href="/signin">
                                        <Button size="lg" className="bg-[#9d4833] text-gray-50 hover:bg-[#b35e49] text-2xl px-16  h-[60px]">
                                            Découvrez plus sur notre plateforme
                                            <ArrowRight className="ml-2 w-6 h-6"/>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 relative">
                            <div className="relative z-10">
                                <div
                                    className="relative rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100">
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ejaar-600 to-ejaar-800"></div>
                                    <div className="p-1">
                                        {/* Mock Dashboard UI */}
                                        <div
                                            className="bg-gray-50 rounded-t-lg p-3 border-b border-gray-200 flex items-center">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                            <div className="mx-auto text-xs font-medium text-gray-600">Tableau de bord
                                                de gestion des devis
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white">
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div className="bg-ejaar-50 p-4 rounded-lg">
                                                    <div className="text-xs text-gray-500 mb-1">Dossiers en cours</div>
                                                    <div className="text-xl font-bold">87</div>
                                                    <div className="text-xs text-green-600 mt-1">+4% ce mois-ci</div>
                                                </div>
                                                <div className="bg-ejaar-50 p-4 rounded-lg">
                                                    <div className="text-xs text-gray-500 mb-1">Taux de validation</div>
                                                    <div className="text-xl font-bold">93%</div>
                                                    <div className="text-xs text-green-600 mt-1">+2% ce mois-ci</div>
                                                </div>
                                                <div className="bg-ejaar-50 p-4 rounded-lg">
                                                    <div className="text-xs text-gray-500 mb-1">Statut des contrats
                                                    </div>
                                                    <div className="text-xl font-bold">Bon</div>
                                                    <div className="text-xs text-blue-600 mt-1">Tous les contrats
                                                        validés
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chart mockup */}
                                            <div
                                                className="w-full h-40 bg-gray-50 rounded-lg mb-6 p-4 flex flex-col justify-between">
                                                <div className="text-xs font-medium text-gray-600">Analyse des dossiers
                                                    traités
                                                </div>
                                                <div className="relative h-20 mt-2">
                                                    {/* Chart bars */}
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full px-2">
                                                        {[45, 65, 35, 75, 55, 40, 80, 60, 70, 50, 75].map((height, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-[6%] bg-gradient-to-t from-ejaar-800 to-ejaar-500 rounded-t-sm"
                                                                style={{height: `${height}%`}}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Table mockup */}
                                            <div className="w-full rounded-lg border border-gray-200">
                                                <div
                                                    className="bg-gray-50 py-2 px-4 border-b border-gray-200 text-xs font-medium text-gray-600">
                                                    Activités récentes
                                                </div>
                                                <div className="divide-y divide-gray-200 max-h-32">
                                                    {[
                                                        {text: "Nouveau devis validé", time: "Il y a 2h"},
                                                        {text: "Validation bancaire effectuée", time: "Hier"},
                                                        {text: "Contrat signé", time: "Il y a 3 jours"},
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between py-2 px-4 text-xs">
                                                            <span>{item.text}</span>
                                                            <span className="text-gray-400">{item.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div
                                className="absolute -z-10 -right-10 -bottom-10 w-64 h-64 bg-ejaar-100 rounded-full"></div>
                            <div className="absolute -z-10 right-20 top-10 w-20 h-20 bg-ejaar-200 rounded-full"></div>
                            <div className="absolute -z-10 -left-5 top-20 w-32 h-32 bg-ejaar-50 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const FeatureCard = ({
                         icon,
                            type='yellow',
                         title,
                         description,
                         highlighted = false
                     }: {
    icon: React.ReactNode;
    title: string;
    type?: string;
    description: string;
    highlighted?: boolean;
}) => {
    return (
        <div
            className={cn(`rounded-xl p-8 mt-2 group transition-all duration-300
             hover:-translate-y-1 max-w-[600px]`,
                type === 'green' ? `hover:bg-[#e5eae9]`: `hover:bg-[#f7ecde]`,
                )}
        >
            <Button className={cn(` cursor-default 
             group text-xl mb-2`,
                                    type === 'green' ? `hover:bg-[#4a7971] bg-[#4a7971]`: `bg-[#deb679] hover:bg-[#deb679]`,
                type === 'red' ? `group-hover:bg-[#9d4833]` : ``
            )}>
                {title}
            </Button>
            {type === `green` &&
                <>
                    {icon}
                </>}
            <p className='text-ejaar-700 text-lg text-justify'>
                {description}
            </p>
        </div>
    );
};

export default Features;
