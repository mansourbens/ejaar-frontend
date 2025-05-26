import {Card} from "@/components/ui/card";
import {CheckCircle, CheckCircle2Icon, DownloadIcon, FileText, Info} from "lucide-react";
import {Quotation, QuotationStatusEnum} from "@/lib/mock-data";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import React, {useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {fetchWithToken} from "@/lib/utils";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

interface QuotationInfoStepProps {
    quotation: Quotation;
    onStepUpdate: (newStep: QuotationStatusEnum) => void;
}
function QuotationInfoStep({ quotation, onStepUpdate }: QuotationInfoStepProps) {
    const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
    const {toast} = useToast();
    const router = useRouter();

    const handleValidate = async () => {
        const quotationId = quotation?.id;

        try {
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/${quotationId}/validate`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to validate quotation');
            }

            toast({
                title: 'Succes',
                description: "Devis validé avec succès.",
                variant: 'success',
            });
            quotation.status = QuotationStatusEnum.VALIDE_CLIENT;
            onStepUpdate(QuotationStatusEnum.VALIDE_CLIENT);
            setIsValidateDialogOpen(false);
        } catch (error) {
            toast({
                title: 'Erreur',
                description: "Erreur lors de la validation du devis. Veuillez réessayer.",
                variant: 'destructive',
            });
            console.error(error);
        } finally {
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-4">

            <Card className="bg-white/50 p-4 text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-[#f5ebdd] rounded-full flex items-center justify-center">
                        <CheckCircle2Icon className="w-8 h-8 text-ejaar-green" />
                    </div>
                    <h3 className="text-xl font-bold text-ejaar-700">Devis créé avec succès</h3>
                    <p className="text-gray-600 max-w-md text-sm">
                        Votre demande de devis a été créée et enregistrée dans notre système.
                        Vous pouvez maintenant procéder au téléchargement des documents requis.
                    </p>
                    <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4 mt-6">
                        <div className="flex items-center space-x-8">
                            <FileText className="w-5 h-5 text-ejaar-700 mt-2" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-ejaar-700">Prochaine étape</p>
                                <p className="text-sm text-gray-800">
                                    Téléchargez les documents nécessaires pour continuer le processus de validation.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button className="bg-ejaar-700 hover:bg-ejaar-900 group text-sm" size="sm">
                                    <DownloadIcon className="h-5 w-5 mr-3" />
                                    Telecharger le devis
                                </Button>
                                <Button
                                    disabled={quotation.status !== QuotationStatusEnum.GENERE}
                                    onClick={() => setIsValidateDialogOpen(true)}
                                    className="bg-[#9d4833] hover:bg-[#b35e49] group text-sm" size="sm">
                                    <CheckCircle2Icon className="h-5 w-5 mr-3" />
                                    Valider le devis
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <Dialog open={isValidateDialogOpen} onOpenChange={setIsValidateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-blue-100 shadow-xl">

                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-50">
                                <FileText className="h-5 w-5 text-blue-600"/>
                            </div>
                            <DialogTitle className="text-blue-900 text-lg font-semibold">
                                Validation du devis N°{quotation?.number}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="py-4 px-2">
                        <div className="flex items-start p-4 border border-blue-100 rounded-lg bg-blue-50">
                            <Info className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0"/>
                            <p className="ml-2 text-sm text-blue-700">
                                Après confirmation, vous devrez téléverser les justificatifs nécessaires pour passer à l’étape suivante.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsValidateDialogOpen(false)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleValidate}
                            className="bg-ejaar-800 hover:bg-ejaar-700 text-white shadow-sm"
                        >
                            <CheckCircle className="mr-2 h-4 w-4"/>
                            Confirmer la validation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
export default QuotationInfoStep;
