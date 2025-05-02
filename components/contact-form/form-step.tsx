
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormStepProps = {
    children: ReactNode;
    isActive: boolean;
    className?: string;
};

const FormStep = ({ children, isActive, className }: FormStepProps) => {
    if (!isActive) return null;

    return (
        <div
            className={cn(
                "w-full px-4 animate-slide-in",
                className
            )}
        >
            {children}
        </div>
    );
};

export default FormStep;
