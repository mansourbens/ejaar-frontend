
"use client";
import React from 'react';
import RentCalculator from "@/components/landing-page/rent-calculator";
import {Card} from "@/components/ui/card";

const RentEstimation = () => {
    return (
        <section id="solutions" className="py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="blue-blur-circle w-96 h-96 left-[-10%] top-[-10%]"></div>
                <div className="blue-blur-circle w-80 h-80 right-[-5%] bottom-[-5%]"></div>
            </div>
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl lato-bold mb-4">
                        Calculez votre loyer en <span className="gradient-text">30 secondes</span> et découvrez nos solutions de financement
                    </h2>
                </div>
                <Card className="w-2/4 m-auto">
                    <div className=" h-full rounded-xl bg-white/70 backdrop-blur-sm p-8 shadow-inner">
                        <RentCalculator onBack={() => {}} hideHeader={true} />
                    </div>
                </Card>
            </div>
        </section>
    );
};

const SolutionCard = ({
                          icon,
                          title,
                          description
                      }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) => {
    return (
        <div className="card-glow group hover:shadow-2xl transition-all duration-300">
            <div className="text-ejaar-800 mb-5">{icon}</div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <a
                href={`#${title.toLowerCase()}`}
                className="inline-flex items-center text-ejaar-700 font-medium group-hover:text-ejaar-800 transition-colors"
            >
                Learn more
                <svg
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
    );
};

export default RentEstimation;
