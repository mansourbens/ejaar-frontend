
import React from 'react';
import { Clock, Shield, ArrowRight, CreditCard } from 'lucide-react';
import Process from "@/components/landing-page/process";

const Features = () => {
    return (
        <section id="features" className="py-20 bg-gradient-to-b from-white to-ejaar-50">
            <div className="container mx-auto px-4">
                <Process></Process>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex flex-wrap md:flex-nowrap justify-center items-center text-3xl md:text-4xl mb-4 lato-bold gap-2">
                        <h2 className="whitespace-nowrap">Pourquoi choisir</h2>
                        <img
                            alt="logo"
                            src="/assets/logos/ejaar_logo_v2.svg"
                            width={180}
                            height={20}
                            className="inline-block mx-2"
                        />
                        <h2 className="whitespace-nowrap">pour la location de matériel ?</h2>
                    </div>
                    <p className="text-lg text-gray-700">
                        Nous combinons du matériel de pointe avec des options de location flexibles pour faire avancer votre entreprise.
                    </p>
                </div>


                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Clock />}
                        title="Validation en moins de 48 h"
                        description="Notre workflow digital, orchestrant fournisseurs et partenaires bancaires, valide vos financements sous 48h, assurant un parcours de leasing fluide et sécurisé."
                    />
                    <FeatureCard
                        icon={<CreditCard />}
                        title="Financement flexible"
                        description="Transformez vos investissements IT en charges opérationnelles prévisibles grâce à des plans de loyers sur‑mesure parfaitement calibrés à votre capacité budgétaire."
                        highlighted={true}
                    />
                    <FeatureCard
                        icon={<Shield />}
                        title="Support complet"
                        description="Appuyez‑vous sur un support 24/7, une maintenance proactive, des garanties étendues et une assurance tous risques intégrée."
                    />
                </div>

                {/* Feature Grid */}
                <div className="mt-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="mb-8">
                                <span className="text-ejaar-800 font-semibold">GESTION SIMPLIFIÉE</span>
                                <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                                    Contrôlez facilement vos dossiers de devis
                                </h3>
                                <p className="text-gray-700 mb-6">
                                    Notre plateforme intuitive vous permet de suivre vos dossiers en temps réel, depuis la demande de devis jusqu’à la signature du contrat, avec une validation fluide par les banques.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Suivi en temps réel des demandes de devis",
                                        "Validation automatisée par les banques",
                                        "Prévisions financières détaillées et analyses des coûts",
                                        "Création facile de demandes de support"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="mr-3 mt-1 text-ejaar-600">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8">
                                    <a href="/signin" className="inline-flex items-center text-ejaar-800 font-medium hover:text-ejaar-600 transition-colors">
                                        Découvrez plus sur notre plateforme
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 relative">
                            <div className="relative z-10">
                                <div className="relative rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ejaar-600 to-ejaar-800"></div>
                                    <div className="p-1">
                                        {/* Mock Dashboard UI */}
                                        <div className="bg-gray-50 rounded-t-lg p-3 border-b border-gray-200 flex items-center">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                            <div className="mx-auto text-xs font-medium text-gray-600">Tableau de bord de gestion des devis</div>
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
                                                    <div className="text-xs text-gray-500 mb-1">Statut des contrats</div>
                                                    <div className="text-xl font-bold">Bon</div>
                                                    <div className="text-xs text-blue-600 mt-1">Tous les contrats validés</div>
                                                </div>
                                            </div>

                                            {/* Chart mockup */}
                                            <div className="w-full h-40 bg-gray-50 rounded-lg mb-6 p-4 flex flex-col justify-between">
                                                <div className="text-xs font-medium text-gray-600">Analyse des dossiers traités</div>
                                                <div className="relative h-20 mt-2">
                                                    {/* Chart bars */}
                                                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full px-2">
                                                        {[45, 65, 35, 75, 55, 40, 80, 60, 70, 50, 75].map((height, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-[6%] bg-gradient-to-t from-ejaar-800 to-ejaar-500 rounded-t-sm"
                                                                style={{ height: `${height}%` }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Table mockup */}
                                            <div className="w-full rounded-lg border border-gray-200">
                                                <div className="bg-gray-50 py-2 px-4 border-b border-gray-200 text-xs font-medium text-gray-600">
                                                    Activités récentes
                                                </div>
                                                <div className="divide-y divide-gray-200 max-h-32">
                                                    {[
                                                        { text: "Nouveau devis validé", time: "Il y a 2h" },
                                                        { text: "Validation bancaire effectuée", time: "Hier" },
                                                        { text: "Contrat signé", time: "Il y a 3 jours" },
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
                            <div className="absolute -z-10 -right-10 -bottom-10 w-64 h-64 bg-ejaar-100 rounded-full"></div>
                            <div className="absolute -z-10 right-20 top-10 w-20 h-20 bg-ejaar-200 rounded-full"></div>
                            <div className="absolute -z-10 -left-5 top-20 w-32 h-32 bg-ejaar-50 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({
                         icon,
                         title,
                         description,
                         highlighted = false
                     }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    highlighted?: boolean;
}) => {
    return (
        <div
            className={`rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                highlighted
                    ? 'bg-ejaar-800 text-white shadow-lg'
                    : 'bg-white shadow border border-gray-100'
            }`}
        >
            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
                    highlighted
                        ? 'bg-white/10'
                        : 'bg-ejaar-50'
                }`}
            >
                <div className={highlighted ? 'text-white' : 'text-ejaar-700'}>
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className={highlighted ? 'text-gray-200' : 'text-gray-700'}>
                {description}
            </p>
        </div>
    );
};

export default Features;
