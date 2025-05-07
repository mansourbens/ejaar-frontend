"use client";
import React, { useState, useEffect } from "react";
import ProgressStepBar from "./progress-step-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProgressStepBarDemoProps {
    initialStep?: number;
}

const Process: React.FC<ProgressStepBarDemoProps> = ({ initialStep = 1 }) => {
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
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentStep(prevStep => {
                if (prevStep >= totalSteps) return 1;
                return prevStep + 1;
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [currentStep]);

    return (
        <div className="bg-gradient-to-b from-gray-50 to-ejaar-50 rounded-xl shadow-md p-6 md:p-8 mb-24">
            <h2 className="text-2xl md:text-3xl lato-bold text-center text-gray-900 mb-8">
                Notre processus simplifié
            </h2>

            <ProgressStepBar currentStep={currentStep} />

        </div>
    );
};

export default Process;
