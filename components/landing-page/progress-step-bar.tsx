import React from "react";
import { cn } from "@/lib/utils";
import { Check, Package2, FileText, Headphones } from "lucide-react";

interface ProgressStepBarProps {
    currentStep?: number;
    className?: string;
}

const ProgressStepBar: React.FC<ProgressStepBarProps> = ({
                                                             currentStep = 1,
                                                             className,
                                                         }) => {
    const steps = [
        {
            number: 1,
            title: "Définissez vos besoins avec votre fournisseur",
            icon: Package2,
            description: "Sélectionnez les équipements dont vous avez besoin",
        },
        {
            number: 2,
            title: "Obtenez votre devis et déposez votre dossier",
            icon: FileText,
            description: "Recevez une proposition adaptée à vos besoins",
        },
        {
            number: 3,
            title: "Profitez & Renouvelez",
            icon: Headphones,
            description: "Assistance 24/7, reprise ou upgrade en fin de contrat",
        },
    ];

    return (
        <div className={cn("w-full py-8 px-4", className)}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start relative">
                    {/* Connect line between steps */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gray-200 z-0" />
                    <div
                        className="hidden md:block absolute top-12 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 z-0 transition-all duration-300 ease-in-out"
                        style={{
                            width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`,
                        }}
                    />

                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep >= step.number;
                        const isComplete = currentStep > step.number;

                        return (
                            <div
                                key={step.number}
                                className={cn(
                                    "flex flex-row md:flex-col items-center md:items-start",
                                    "w-full md:w-1/3 mb-6 md:mb-0 relative z-10",
                                    index < steps.length - 1 ? "md:pr-4" : "",
                                )}
                            >
                                {/* Mobile connector line */}
                                {index > 0 && (
                                    <div className="md:hidden w-12 h-1 bg-gray-200 mr-4">
                                        {isActive && <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" />}
                                    </div>
                                )}

                                {/* Step icon circle - now bigger */}
                                <div
                                    className={cn(
                                        "flex items-center justify-center",
                                        "w-24 h-24 rounded-full shadow-lg",
                                        "transition-all duration-300 transform", "bg-white text-gray-400 border border-gray-200",
                                        index === 1  && "m-auto",
                                        index === 2 && "ml-auto"
                                    )}
                                >
                                    <div className="text-4xl text-[#182e43]">{index + 1}</div>
                                </div>

                                {/* Step text content */}
                                <div className="ml-4 md:ml-0 md:mt-4 flex-1">
                                    <h3
                                        className={cn(
                                            "font-semibold text-lg md:text-xl",
                                            isActive ? "text-ejaar-800" : "text-gray-500",
                                            index === 1 && "ml-12",
                                            index === 2 && "ml-28"

                                        )}
                                    >
                                        {step.title}
                                    </h3>
                                    <p className={cn(
                                        "text-sm md:text-base mt-1",
                                        isActive ? "text-gray-700" : "text-gray-400",
                                        index === 1 && "ml-12",
                                        index === 2 && "ml-28"
                                    )}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProgressStepBar;
