"use client";

import {Quotation, QuotationStatusEnum} from "@/lib/mock-data";
import React, {useEffect, useState} from "react";
import QuotationDocuments from "@/components/quotations/quotation-documents";
import {QuotationStepper} from "@/components/quotations/quotation-stepper";
import QuotationInfoStep from "@/components/quotations/quotation-info-step";
import {QuotationVerificationStep} from "@/components/quotations/quotation-verification-step";
import {QuotationContractStep} from "@/components/quotations/quotation-contract-step";
import {fetchWithToken} from "@/lib/utils";
import {useToast} from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/main-layout";
import Loader from "@/components/ui/loader";
import {Card} from "@/components/ui/card";
import {FileText} from "lucide-react";
import {Badge} from "@/components/ui/badge";

interface QuotationStepperPageProps {
    quotationStatus?: QuotationStatusEnum;
    quotationId?: string;
}

export default function QuotationStepperPage({
                                                 params
                                             }: { params: { id: string } }) {
    const [currentStatus, setCurrentStatus] = useState<QuotationStatusEnum | undefined>();
    const [viewingStep, setViewingStep] = useState<QuotationStatusEnum | undefined>();
    const [quotation, setQuotation] = useState<Quotation | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    useEffect(() => {
        if (!quotation) return;
        setCurrentStatus(quotation.status);
        setViewingStep(quotation.status);
    }, [quotation]);
    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/${params.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch quotation');
                }

                const data = await response.json();
                setQuotation(data);
            } catch (err) {
                toast({
                    title: 'Error',
                    description: 'Failed to load quotation',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuotation();
    }, [params.id, toast]);
    const handleStepClick = (stepId: QuotationStatusEnum) => {
        setViewingStep(stepId);
    };

    const renderStepContent = () => {
        switch (viewingStep) {
            case QuotationStatusEnum.GENERE:
                return <QuotationInfoStep quotation={quotation!}
                                          onStepUpdate={(newStep) => {
                                              setViewingStep(newStep);
                                              setCurrentStatus(newStep);
                                          }}
                />;
            case QuotationStatusEnum.VALIDE_CLIENT:
                return <QuotationDocuments quotation={quotation!}
                                           onStepUpdate={(newStep) => {
                                               setViewingStep(newStep);
                                               setCurrentStatus(newStep);
                                           }}
                />;
            case QuotationStatusEnum.VERIFICATION:
            case QuotationStatusEnum.SENT_TO_BANK:
                return <QuotationVerificationStep />;
            case QuotationStatusEnum.VALIDE:
                return <QuotationContractStep />;
            default:
                return <QuotationInfoStep quotation={quotation!}
                                          onStepUpdate={(newStep) => {
                                              setViewingStep(newStep);
                                              setCurrentStatus(newStep);
                                          }}
                />;
        }
    };

    return (
        <MainLayout>
        {quotation && currentStatus ?
            <>
                <Card className="bg-white/50 mb-4 ">
                    <div className="flex items-start gap-6 p-4">
                        {/* Title Section */}
                        <div className="flex items-center gap-6 mt-2 min-w-[180px]">
                            <FileText className="h-5 w-5 text-ejaar-800"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Récapitulatif du devis</h3>
                            </div>
                        </div>

                        {/* Details Grid - Moved closer */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-2 flex-1 ml-4">
                            <div>
                                <p className="text-xs font-medium text-ejaar-800">Numéro</p>
                                <p className="text-sm font-medium text-gray-900">{quotation.number}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-ejaar-800">Date</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-ejaar-800">Matériel</p>
                                {quotation.devices?.split(',').map((type, index) => (
                                    <Badge key={index}
                                           className="mr-1 mb-1 text-[9px] p-1.5 bg-ejaar-700 hover:bg-ejaar-700 cursor-default">
                                        {type}
                                    </Badge>
                                ))}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-ejaar-800">Montant</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {quotation.amount?.toFixed(2)} DH
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-ejaar-800">Mensualité</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {quotation.totalMonthlyPayments?.toFixed(2)} DH
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
                <QuotationStepper
                    currentStatus={currentStatus}
                    onStepClick={handleStepClick}
                >
                    {renderStepContent()}
                </QuotationStepper>
            </>
: <div>
                <Loader size={100} color="#53769b"/>
            </div>}
        </MainLayout>
    );
}
