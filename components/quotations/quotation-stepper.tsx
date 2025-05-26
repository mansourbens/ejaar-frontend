"use client";
import {QuotationStatusEnum} from "@/lib/mock-data";
import {CheckCircle, Download, FileCheck, FileText, FolderUp, SearchCheck, Shield, Signature} from "lucide-react";
import {cn} from "@/lib/utils";
import {useState} from "react";

interface StepperProps {
    currentStatus: QuotationStatusEnum;
    children: React.ReactNode;
    onStepClick?: (stepId: QuotationStatusEnum) => void;
}

interface StepConfig {
    id: QuotationStatusEnum;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

const steps: StepConfig[] = [
    {
        id: QuotationStatusEnum.GENERE,
        title: 'Information',
        description: 'Devis créé',
        icon: FileText,
    },
    {
        id: QuotationStatusEnum.VALIDE_CLIENT,
        title: 'Documents',
        description: 'Téléchargement',
        icon: FolderUp,
    },
    {
        id: QuotationStatusEnum.VERIFICATION,
        title: 'Vérification',
        description: 'En cours',
        icon: SearchCheck,
    },
    {
        id: QuotationStatusEnum.VALIDE,
        title: 'Contrat',
        description: 'Signature',
        icon: Signature,
    },
];

const getStepStatus = (stepId: QuotationStatusEnum, currentStatus: QuotationStatusEnum) => {
    const stepOrder = [QuotationStatusEnum.GENERE, QuotationStatusEnum.VALIDE_CLIENT, QuotationStatusEnum.VERIFICATION, QuotationStatusEnum.SENT_TO_BANK, QuotationStatusEnum.VALIDE];
    const currentIndex = stepOrder.indexOf(currentStatus);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex +1 === currentIndex && currentStatus === QuotationStatusEnum.SENT_TO_BANK) return 'current';

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
};

const canNavigateToStep = (stepId: QuotationStatusEnum, currentStatus: QuotationStatusEnum) => {
    const status = getStepStatus(stepId, currentStatus);
    return status === 'completed' || status === 'current';
};

export function QuotationStepper({ currentStatus, children, onStepClick }: StepperProps) {
    const [selectedStep, setSelectedStep] = useState<QuotationStatusEnum | null>(null);


    const handleStepClick = (stepId: QuotationStatusEnum) => {
        if (canNavigateToStep(stepId, currentStatus)) {
            setSelectedStep(stepId);
            if (onStepClick) {
                onStepClick(stepId);
            }
        }
    };

    const isStepSelected = (stepId: QuotationStatusEnum) => {
        return selectedStep === stepId;
    };

    return (
        <div className="">
            {/* Stepper Header */}
            <div className="bg-white/50 rounded-2xl shadow-md px-4 py-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const status = getStepStatus(step.id, currentStatus);
                            const Icon = step.icon;
                            const canNavigate = canNavigateToStep(step.id, currentStatus);
                            const selected = isStepSelected(step.id);

                            return (
                                <>
                                    <div
                                        className={cn(
                                            "flex flex-col items-center space-y-1",
                                            canNavigate && onStepClick && "cursor-pointer"
                                        )}
                                        onClick={() => handleStepClick(step.id)}
                                    >
                                        {/* Step Circle */}
                                        <div
                                            className={cn(
                                                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                                                status === 'completed'  && "bg-ejaar-green border-ejaar-greenHover hover:bg-ejaar-greenHover text-white",
                                                status === 'current' &&  "bg-ejaar-red border-ejaar-redHover  hover:bg-ejaar-redHover text-white shadow-lg",
                                                status === 'pending' && "bg-gray-100 border-gray-300 text-gray-400",
                                                canNavigate && onStepClick && "hover:shadow-md"
                                            )}
                                        >
                                            {status === 'completed' && !selected ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </div>

                                        {/* Step Text */}
                                        <div className="text-center">
                                            <p
                                                className={cn(
                                                    "text-xs font-medium",
                                                    status === 'completed' && "text-green-600",
                                                    status === 'current'  && "text-ejaar-700 font-bold",
                                                    status === 'pending' && "text-gray-400",
                                                )}
                                            >
                                                {step.title}
                                            </p>
                                            {selected  && <div className="h-0.5 w-2/4 mt-0.5 mx-auto bg-ejaar-redHover"></div>}
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                "flex-1 h-0.5 mb-6 mx-2 transition-all duration-300",
                                                getStepStatus(steps[index + 1].id, currentStatus) !== 'pending'
                                                    ? "bg-ejaar-green"
                                                    : "bg-gray-300"
                                            )}
                                        />
                                    )}
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="pt-8">
                {children}
            </div>
        </div>
    );
}
