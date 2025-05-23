
"use client";
import React from 'react';
import RentCalculator from "@/components/landing-page/rent-calculator";
import {Card} from "@/components/ui/card";

const RentEstimation = () => {
    return (
        <section id="solutions" className="relative bg-[#fcf5eb] overflow-hidden">
            <div id="simuler" className="divider-ejaar h-1 w-[200px] sm:w-[300px] mx-auto bg-[#4a7971] my-6 sm:my-8"></div>
            <div className="container mx-auto px-4">
                <div className="text-center mx-auto mb-12 sm:mb-16 px-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug text-[#182e43]">
                        Calculez votre loyer en <span className="text-[#9d4833]">30 secondes</span><br className="hidden sm:block" />
                        et découvrez nos solutions de financement
                    </h2>
                </div>

                <Card className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 mx-auto bg-white/50 rounded-3xl hover:shadow-xl mb-12 sm:mb-16 p-4 sm:p-6 md:p-8">
                    <RentCalculator onBack={() => {}} hideHeader={true} />
                </Card>
            </div>
        </section>
    );
};

export default RentEstimation;

