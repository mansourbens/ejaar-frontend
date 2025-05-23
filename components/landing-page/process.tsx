"use client";
import React, {useState, useEffect} from "react";
import ProgressStepBar from "./progress-step-bar";
import {Button} from "@/components/ui/button";
import {ArrowLeft, ArrowRight} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface ProgressStepBarDemoProps {
    initialStep?: number;
}

const Process: React.FC<ProgressStepBarDemoProps> = ({initialStep = 3}) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="p-4 md:p-8 mb-12 md:mb-24">
            <div className="container mx-auto px-0 sm:px-4 relative z-10">
                <div className="grid lg:grid-cols-2 items-center gap-8">
                    <div className="flex flex-col space-y-4 md:space-y-8 animate-fade-in">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold text-[#182e43]">
                            Un processus <span className="text-[#256aa3]">simplifié</span> tout au long
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-justify text-[#344e69] max-w-xl lat-bold">
                            Du devis à la mise en service, tout s'enchaîne : un clic, un accord éclair, votre parc IT
                            opérationnel. Ejaar transforme le leasing en simple levier de croissance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 md:gap-8 md:ml-12">
                        <div className="relative perspective mb-auto min-h-[400px] md:min-h-[500px]">
                            <div className="flex flex-col md:gap-12">
                                {/* Step 1 */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                    <div className="order-2 sm:order-1 flex flex-col sm:flex-row gap-4 w-full">
                                        <div className="flex items-start gap-3 sm:gap-4"> {/* Changed gap from fixed to responsive */}
                                            <div className={cn(
                                                "flex-shrink-0", // Prevent shrinking
                                                "flex items-center justify-center",
                                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg",
                                                "transition-all duration-300 transform bg-ejaar-700 text-gray-50 border border-gray-200",
                                            )}>
                                                <div className="text-sm sm:text-xl">1</div>
                                            </div>
                                            <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent text overflow */}
                                                <h3 className={cn(
                                                    "font-semibold text-xl sm:text-2xl text-ejaar-800",
                                                )}>
                                                    Définissez vos besoins en matériel
                                                </h3>
                                                <p className={cn(
                                                    "text-sm sm:text-lg mt-1",
                                                    'max-w-full sm:max-w-[380px]',
                                                    'text-justify'
                                                )}>
                                                    Identifiez les équipements à financer et la durée de location. La
                                                    démarche peut être initiée par vous ou directement par votre
                                                    fournisseur
                                                </p>
                                            </div>

                                            <img
                                                src='/assets/images/step_1.png'
                                                className="order-3 ml-auto w-20 sm:w-24 md:w-32 lg:w-40"
                                                alt="Step 1 illustration"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <img
                                    src='/assets/images/arrow_right.png'
                                    className="hidden sm:block absolute top-[120px] sm:top-[150px] right-[20px] w-8 md:w-12"
                                    alt="Arrow right"
                                />
                                <div className="flex justify-start my-2 sm:hidden">
                                    <img
                                        src='/assets/images/arrow_left.png'
                                        className="w-8 h-20"
                                        alt="Step arrow"
                                    />
                                </div>

                                {/* Step 2 */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mt-0 xl:mt-8 2xl:mt-0">
                                    <div className="order-2 sm:order-1 flex flex-col sm:flex-row gap-4 w-full">
                                        <div className="flex items-start gap-3 sm:gap-4"> {/* Changed gap from fixed to responsive */}
                                            <div className={cn(
                                                "flex-shrink-0", // Prevent shrinking
                                                "flex items-center justify-center",
                                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg",
                                                "transition-all duration-300 transform bg-ejaar-700 text-gray-50 border border-gray-200",
                                            )}>
                                                <div className="text-sm sm:text-xl">2</div>
                                            </div>
                                            <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent text overflow */}
                                                <h3 className={cn(
                                                    "font-semibold text-xl sm:text-2xl text-ejaar-800",
                                                    'text-justify'
                                                )}>
                                                    Obtenez une offre instantanée
                                                </h3>
                                                <p className={cn(
                                                    "text-sm sm:text-lg mt-1",
                                                    'max-w-full sm:max-w-[340px]',
                                                    'text-justify'
                                                )}>
                                                    Recevez un devis tout inclus (financement, assurance, maintenance)
                                                    et soumettez votre dossier en ligne en quelques minutes
                                                </p>
                                            </div>
                                            <img
                                                src='/assets/images/step_2.png'
                                                className="w-20 sm:w-24 md:w-32 lg:w-40"
                                                alt="Step 2 illustration"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <img
                                    src='/assets/images/arrow_left.png'
                                    className="hidden sm:block absolute top-[280px]    xl:top-[360px] 2xl:top-[260px] left-[-30px] md:left-[-50px] w-8 md:w-12"
                                    alt="Arrow left"
                                />

                                <div className="flex justify-end my-2 sm:hidden">
                                    <img
                                        src='/assets/images/arrow_right.png'
                                        className="w-8 h-20"
                                        alt="Step arrow"
                                    />
                                </div>

                                {/* Step 3 */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                    <div className="order-2 sm:order-1 flex flex-col sm:flex-row gap-4 w-full">
                                        <div className="flex items-start gap-3 sm:gap-4"> {/* Changed gap from fixed to responsive */}
                                            <div className={cn(
                                                "flex-shrink-0", // Prevent shrinking
                                                "flex items-center justify-center",
                                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg",
                                                "transition-all duration-300 transform bg-ejaar-700 text-gray-50 border border-gray-200",
                                            )}>
                                                <div className="text-sm sm:text-xl">3</div>
                                            </div>
                                            <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent text overflow */}
                                                <h3 className={cn(
                                                    "font-semibold text-xl sm:text-2xl text-ejaar-800",
                                                )}>
                                                    Utilisez en toute sérénité
                                                </h3>
                                                <p className={cn(
                                                    "text-sm sm:text-lg mt-1",
                                                    'max-w-full sm:max-w-[370px]',
                                                )}>
                                                    Profitez de vos équipements avec un accompagnement continu, et
                                                    choisissez la reprise ou l'upgrade en fin de contrat
                                                </p>
                                            </div>
                                            <img
                                                src='/assets/images/step_3.png'
                                                className="order-3 ml-auto w-20 sm:w-24 md:w-32 lg:w-40"
                                                alt="Step 3 illustration"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Process;
