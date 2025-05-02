import { cn } from "@/lib/utils";

type ProgressIndicatorProps = {
    steps: number;
    currentStep: number;
    onStepClick?: (step: number) => void;
};

const ProgressIndicator = ({
                               steps,
                               currentStep,
                               onStepClick,
                           }: ProgressIndicatorProps) => {
    return (
        <div className="flex items-center justify-center w-full mb-8 mt-2">
            <div className="flex items-center w-full max-w-3xl">
                {Array.from({ length: steps }).map((_, index) => (
                    <div key={index} className="flex items-center w-full">
                        {/* Step Circle */}
                        <div
                            onClick={() => onStepClick && currentStep > index && onStepClick(index)}
                            className={cn(
                                "w-10 h-10 rounded-full grid place-items-center text-sm font-semibold transition-all duration-2500 relative z-10",
                                index < currentStep
                                    ? "bg-ejaar-blue text-white cursor-pointer"
                                    : index === currentStep
                                        ? "bg-ejaar-blue text-white animate-pulse-glow"
                                        : "bg-gray-200 text-gray-500",
                                onStepClick && currentStep > index && "hover:scale-110"
                            )}
                        >
                            {index + 1}
                        </div>

                        {/* Connecting Line */}
                        {index < steps - 1 && (
                            <div className="flex-1 h-1 mx-2">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-500",
                                        index < currentStep
                                            ? "bg-ejaar-blue"
                                            : "bg-gray-200"
                                    )}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressIndicator;
