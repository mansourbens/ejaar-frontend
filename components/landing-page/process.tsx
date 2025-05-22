"use client";
import React, { useState, useEffect } from "react";
import ProgressStepBar from "./progress-step-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface ProgressStepBarDemoProps {
    initialStep?: number;
}

const Process: React.FC<ProgressStepBarDemoProps> = ({ initialStep = 3 }) => {
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

    // Auto-advance every 2 seconds instead of 3 for faster animation


    return (
        <div className="p-6 md:p-8 mb-24">
            <div className="container mx-auto px-2 relative z-10">
                <div className="grid lg:grid-cols-2 items-center">
                    <div className="flex flex-col space-y-8 animate-fade-in">

                        <h1 className="text-4xl text-[#182e43] md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                            Un processus   <span className="text-[#256aa3]">simplifié</span>  tout au long
                        </h1>
                        <p className="text-2xl text-justify text-[#344e69] max-w-xl lat-bold">
                            Du devis à la mise en service, tout s’enchaîne : un clic, un accord éclair, votre parc IT opérationnel. Ejaar transforme le leasing en simple levier de croissance.                        </p>

                    </div>
                    <div className="flex flex-col gap-8 ml-12">


                        <div className="relative perspective mb-auto min-h-[500px]">
                        <div className="flex flex-col gap-12">
                            <div className="flex gap-4">
                                <div className="ml-4 md:ml-0 md:mt-4 flex-1 flex gap-4">
                                    <div
                                        className={cn(
                                            "flex items-center justify-center",
                                            "w-10 h-10 rounded-full shadow-lg my-auto",
                                            "transition-all duration-300 transform", "bg-ejaar-700 text-gray-50 border border-gray-200",
                                        )}
                                    >
                                        <div className="text-xl">1</div>
                                    </div>
                                    <div className="my-auto">
                                    <h3
                                        className={cn(
                                            "font-semibold text-2xl text-ejaar-800",

                                        )}
                                    >
                                        Définissez vos besoins en matériel
                                    </h3>
                                    <p className={cn(
                                        "text-lg mt-1",
                                        'max-w-[380px]',
                                        'text-justify'
                                    )}>
                                        Identifiez les équipements à financer et la durée de location. La démarche peut être initiée par vous ou directement par votre fournisseur
                                    </p>
                                    </div>
                                    <img src='/assets/images/step_1.png' className="mr-12" width={150} />
                                </div>

                            </div>
                            <img src='/assets/images/arrow_right.png'
                                 className="absolute top-[150px] right-[20px]"
                                 width={50} />
                            <div className="flex gap-4">
                                <div className="ml-4 md:ml-0 md:mt-4 flex-1 flex gap-4">
                                    <img src='/assets/images/step_2.png' width={150} />
                                    <div
                                        className={cn(
                                            "flex items-center justify-center",
                                            "w-10 h-10 rounded-full shadow-lg my-auto",
                                            "transition-all duration-300 transform", "bg-ejaar-700 text-gray-50 border border-gray-200",
                                        )}
                                    >
                                        <div className="text-xl">2</div>
                                    </div>

                                    <div className="my-auto">
                                        <h3
                                            className={cn(
                                                "font-semibold text-2xl text-ejaar-800",
                                                'text-justify'

                                            )}
                                        >
                                            Obtenez une offre instantanée
                                        </h3>
                                        <p className={cn(
                                            "text-lg mt-1",
                                            'max-w-[340px]',
                                            'text-justify'
                                        )}>
                                            Recevez un devis tout inclus (financement, assurance, maintenance) et soumettez votre dossier en ligne en quelques minutes
                                        </p>
                                    </div>

                                </div>

                            </div>
                            <img src='/assets/images/arrow_left.png'
                                 className="absolute top-[360px] left-[-50px]"
                                 width={50} />
                            <div className="flex gap-4">
                                <div className="ml-4 md:ml-0 md:mt-4 flex-1 flex gap-4">
                                    <div
                                        className={cn(
                                            "flex items-center justify-center",
                                            "w-10 h-10 rounded-full shadow-lg my-auto",
                                            "transition-all duration-300 transform", "bg-ejaar-700 text-gray-50 border border-gray-200",
                                        )}
                                    >
                                        <div className="text-xl">3</div>
                                    </div>
                                    <div className="my-auto">
                                        <h3
                                            className={cn(
                                                "font-semibold text-2xl text-ejaar-800",

                                            )}
                                        >
                                            Utilisez en toute sérénité
                                        </h3>
                                        <p className={cn(
                                            "text-lg mt-1",
                                            'max-w-[370px]',
                                        )}>
                                            Profitez de vos équipements avec un accompagnement continu, et choisissez la reprise ou l’upgrade en fin de contrat                                        </p>
                                    </div>
                                    <img src='/assets/images/step_3.png' width={160} />
                                </div>

                            </div>

                        </div>

                                {/*<ProgressStepBar currentStep={currentStep} />*/}

                    </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Process;
