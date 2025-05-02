"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FormStep from "./form-step";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    Building,
    User,
    Info
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useToast} from "@/hooks/use-toast";
import ProgressIndicator from "@/components/contact-form/progress-indicator";

type FormData = {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    referralSource: string;
};

const ContactForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        referralSource: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const totalSteps = 5;

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 0:
                return formData.name.trim().length > 0 && formData.company.trim().length > 0;
            case 1:
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(formData.email);
            case 2:
                // Simple validation for phone number (at least 8 digits)
                return formData.phone.match(/^\d{9}$/);
            case 3:
                return true; // Message is optional
            case 4:
                return formData.referralSource.trim().length > 0;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < totalSteps - 1) {
                setCurrentStep((prev) => prev + 1);
            } else {
                handleSubmit();
            }
        } else {
            toast({
                title: "Erreur de validation",
                description: "Veuillez remplir correctement tous les champs obligatoires.",
                variant: "destructive",
            });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast({
            title: "Succès !",
            description: "Votre message a été envoyé. Notre équipe vous contactera prochainement.",
        });

        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
            referralSource: "",
        });
        setCurrentStep(0);
        setIsSubmitting(false);
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 0:
                return "Qui êtes-vous ?";
            case 1:
                return "Comment vous contacter ?";
            case 2:
                return "Quel est votre numéro de téléphone ?";
            case 3:
                return "Dites-nous en plus sur vos besoins";
            case 4:
                return "Comment avez-vous entendu parler de nous ?";
            default:
                return "";
        }
    };

    return (
        <div className="glass-card w-full max-w-3xl mx-auto p-8 overflow-hidden">
            <h2 className="text-3xl font-bold text-center mb-2 text-ejaar-blue">
                Contactez EJAAR
            </h2>
            <p className="text-center text-gray-600 mb-6">
                Solutions de location de matériel informatique adaptées à votre entreprise
            </p>

            <ProgressIndicator
                steps={totalSteps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
            />

            <div className="relative min-h-[300px]">
                <div className="mb-8">
                    <h3 className="text-2xl font-medium text-ejaar-blue text-center mb-6">
                        {getStepTitle()}
                    </h3>

                    <FormStep isActive={currentStep === 0}>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="name" className="text-base font-medium">
                                    Votre nom
                                </Label>
                                <div className="relative mt-2">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Entrez votre nom complet"
                                        value={formData.name}
                                        onChange={(e) => updateFormData("name", e.target.value)}
                                        className="h-12 text-base pl-10 focus:input-highlight"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="company" className="text-base font-medium">
                                    Nom de l'entreprise
                                </Label>
                                <div className="relative mt-2">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <Input
                                        id="company"
                                        type="text"
                                        placeholder="Nom de votre entreprise ou organisation"
                                        value={formData.company}
                                        onChange={(e) => updateFormData("company", e.target.value)}
                                        className="h-12 text-base pl-10 focus:input-highlight"
                                    />
                                </div>
                            </div>
                        </div>
                    </FormStep>

                    <FormStep isActive={currentStep === 1}>
                        <div className="space-y-4">
                            <Label htmlFor="email" className="text-base font-medium">
                                Adresse e-mail
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={(e) => updateFormData("email", e.target.value)}
                                    className="h-12 text-base pl-10 focus:input-highlight"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </FormStep>

                    <FormStep isActive={currentStep === 2}>
                        <div className="space-y-4">
                            <Label htmlFor="phone" className="text-base font-medium">
                                Numéro de téléphone
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <span className="text-gray-600 absolute left-8 top-1/2 -translate-y-1/2">+212</span>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="6 55 55 55 55"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData("phone", e.target.value)}
                                    className="h-12 text-base pl-20 focus:input-highlight"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </FormStep>

                    <FormStep isActive={currentStep === 3}>
                        <div className="space-y-4">
                            <Label htmlFor="message" className="text-base font-medium">
                                Questions ou commentaires (facultatif)
                            </Label>
                            <div className="relative">
                                <Info className="absolute left-3 top-3 text-gray-500" size={18} />
                                <Textarea
                                    id="message"
                                    placeholder="Parlez-nous de vos besoins ou de toute question que vous avez..."
                                    value={formData.message}
                                    onChange={(e) => updateFormData("message", e.target.value)}
                                    className="min-h-[150px] pl-10 focus:input-highlight text-base"
                                />
                            </div>
                        </div>
                    </FormStep>

                    <FormStep isActive={currentStep === 4}>
                        <div className="space-y-4">
                            <Label htmlFor="referralSource" className="text-base font-medium">
                                Comment avez-vous connu EJAAR ?
                            </Label>
                            <Select
                                onValueChange={(value) => updateFormData("referralSource", value)}
                                value={formData.referralSource}
                            >
                                <SelectTrigger className="h-12 text-base focus:input-highlight">
                                    <SelectValue placeholder="Sélectionnez une option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    <SelectItem value="bouche-a-oreille">Bouche à oreille</SelectItem>
                                    <SelectItem value="salon-professionnel">Salon professionnel</SelectItem>
                                    <SelectItem value="partenaire">Partenaire commercial</SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </FormStep>
                </div>

                <div className="flex justify-between mt-8">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0 || isSubmitting}
                        className={cn(
                            "px-6 transition-all duration-300",
                            currentStep === 0 && "opacity-0 pointer-events-none"
                        )}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className={cn(
                            "px-6 bg-ejaar-blue hover:opacity-90 transition-all duration-300"
                        )}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Envoi...
                            </div>
                        ) : currentStep === totalSteps - 1 ? (
                            "Envoyer"
                        ) : (
                            <>
                                Suivant <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
