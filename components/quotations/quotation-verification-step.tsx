import {useAuth} from "@/components/auth/auth-provider";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {DocumentSection, DocumentType, DocumentUploadState, ServerFile} from "@/types/file-upload";
import {Check, CheckCircle, Clock, File, SearchCheck} from "lucide-react";
import {Card} from "../ui/card";
import React, {useEffect, useState} from "react";
import {Quotation, QuotationStatusEnum} from "@/lib/mock-data";
import FileUploadSection from "../file-upload/file-upload-section";
import {useToast} from "@/hooks/use-toast";
import Loader from "@/components/ui/loader";
import {Button} from "@/components/ui/button";
import {BankValidationDialog} from "@/components/bank-folders/bank-validation-dialog";

const initialState: DocumentUploadState = {
    sections: [
        {
            id: 'section-1',
            title: 'Pièces administratives',
            documentTypes: [
                {id: 'doc-1-1', name: 'Statuts de la société'},
                {id: 'doc-1-2', name: 'Registre de commerce'},
                {id: 'doc-1-3', name: 'Identifiant fiscal (IF)'},
                {id: 'doc-1-4', name: 'Patente'},
                {id: 'doc-1-5', name: 'Attestation d\'inscription à la CNSS'},
                {id: 'doc-1-6', name: 'Cartes d\'identité des dirigeants'},
            ]
        },
        {
            id: 'section-2',
            title: 'Documents financiers',
            documentTypes: [
                {id: 'doc-2-1', name: 'Bilans et comptes de résultats des 3 derniers exercices'},
                {id: 'doc-2-2', name: 'Situations comptables intermédiaires récentes (si dispo)'},
                {id: 'doc-2-3', name: 'Relevés bancaires des 6 derniers mois'},
                {id: 'doc-2-4', name: 'Tableau des engagements bancaires en cours'},
            ]
        },
        {
            id: 'section-3',
            title: 'Documents relatifs au bien à financer',
            documentTypes: [
                {id: 'doc-3-1', name: 'Devis ou facture proforma du fournisseur'},
            ]
        },
        {
            id: 'section-4',
            title: 'Autres documents',
            documentTypes: [
                {id: 'doc-4-1', name: 'Autres documents'},
            ]
        }
    ]
};

export enum FileStatusEnum {
    EN_VERIFICATION,
    VERIFE,
    A_RECTIFIER
}

interface QuotationInfoStepProps {
    quotation: Quotation;
    onStepUpdate: (newStep: QuotationStatusEnum) => void;
}

export function QuotationVerificationStep({ quotation, onStepUpdate }: QuotationInfoStepProps) {
    const {user} = useAuth();
    const {toast} = useToast();
    const [uploadState, setUploadState] = useState<DocumentUploadState>(initialState);
    const [isBankValidationDialogOpen, setIsBankValidationDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentFileId, setCurrentFileId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [serverFiles, setServerFiles] = useState<ServerFile[]>([]);


    function getRectifiableSections(uploadState: DocumentUploadState): DocumentSection[] {
        return uploadState.sections
            .map((section): DocumentSection => {
                const filteredTypes = section.documentTypes.filter((docType): docType is DocumentType => {
                    const uploadedFile = docType.uploadedFile;
                    if (!uploadedFile) return false;

                    const file = uploadedFile.file;

                    const isServerFile = (f: File | ServerFile): f is ServerFile =>
                        typeof (f as ServerFile).status !== 'undefined';

                    return isServerFile(file) && file.status === FileStatusEnum.A_RECTIFIER;
                });

                return {
                    ...section,
                    documentTypes: filteredTypes,
                };
            })
            .filter(section => section.documentTypes.length > 0); // Only keep sections with at least one file to rectify
    }
    const sendToBank = async () => {
        const response = await fetchWithToken(
            `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/to-bank/${quotation?.id}`
        );
        if (response.ok) {
            toast({
                title: "Succès",
                description: 'Dossier envoyé à la banque',
            })
            quotation.status = QuotationStatusEnum.SENT_TO_BANK;
            onStepUpdate(QuotationStatusEnum.SENT_TO_BANK);
        }
    }
    useEffect(() => {
        const fetchDocuments = async () => {
            if (!quotation) return;
            try {
                const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/quotation/${quotation.id}`);
                if (!response.ok) throw new Error('Failed to fetch documents');
                const serverFilesResponse = await response.json();
                console.log(serverFilesResponse);
                setServerFiles(serverFilesResponse);
                setUploadState(prevState => ({
                    sections: prevState.sections.map(section => ({
                        ...section,
                        documentTypes: section.documentTypes.map(docType => {
                            const serverFile = serverFilesResponse.find((f: any) => f.documentType === docType.id);
                            return {
                                ...docType,
                                uploadedFile: serverFile ? {
                                    id: serverFile.id,
                                    file: serverFile,
                                    status: serverFile.status || 'success',
                                    progress: 100,
                                    rectificationReason: serverFile.rectificationReason
                                } : undefined
                            };
                        })
                    }))
                }));
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, [quotation]);
    const onRectifFile = async() => {
        setIsLoading(true);
        try {
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/quotation/${quotation.id}`);
            if (!response.ok) throw new Error('Failed to fetch documents');
            const serverFilesResponse = await response.json();
            setServerFiles(serverFilesResponse);
            setUploadState(prevState => ({
                sections: prevState.sections.map(section => ({
                    ...section,
                    documentTypes: section.documentTypes.map(docType => {
                        const serverFile = serverFilesResponse.find((f: any) => f.documentType === docType.id);
                        return {
                            ...docType,
                            uploadedFile: serverFile ? {
                                id: serverFile.id,
                                file: serverFile,
                                status: serverFile.status || 'success',
                                progress: 100,
                                rectificationReason: serverFile.rectificationReason
                            } : undefined
                        };
                    })
                }))
            }));
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4">
                <Card className="bg-white/50 p-8 text-center shadow-lg flex items-center justify-center h-64">
                    <Loader size={50} color="#53769b"/>
                </Card>
            </div>
        );
    }

    if (user?.role.name === UserRole.SUPER_ADMIN) {
        return (
            <div className="max-w-4xl mx-auto px-4">
                <Card className="bg-white/50 p-8 shadow-lg">
                    <div className="space-y-6">
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-[#f5ebdd] rounded-full flex items-center justify-center mx-auto mb-4">
                                <SearchCheck className="w-8 h-8 text-ejaar-green"/>
                            </div>
                            <h2 className="text-2xl font-bold text-ejaar-700 mb-2">Vérification des documents</h2>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Veuillez vérifier les documents soumis par le client.
                            </p>
                        </div>

                        <div className="flex justify-center mt-4">
                            <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4 w-2/4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-ejaar-green"/>
                                    <span className="text-sm font-medium text-ejaar-green">Documents soumis</span>
                                </div>
                                <p className="text-sm text-ejaar-700">
                                    {uploadState.sections.flatMap(s => s.documentTypes)
                                        .filter(d => d.uploadedFile).length} documents reçus
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6">
                            {uploadState.sections.map((section) => (
                                <FileUploadSection
                                    key={section.id}
                                    section={section}
                                    quotationId={quotation.id}
                                    isValidationHidden={false}
                                    isDeleteHidden={true}
                                />
                            ))}
                        </div>
                        {quotation.status === QuotationStatusEnum.VERIFICATION &&
                            <div>
                                <Button
                                    size="sm"
                                    disabled={!serverFiles.every(doc => doc.status === FileStatusEnum.VERIFE) || serverFiles.filter(doc => doc.status === FileStatusEnum.VERIFE).length < 11}
                                    className="bg-ejaar-green hover:bg-ejaar-greenHover text-white"
                                    onClick={sendToBank }
                                >
                                    <Check className="mr-2 h-4 w-4"/>
                                    Envoyer à la banque
                                </Button>
                            </div>
                        }

                    </div>
                </Card>

            </div>
        );
    }

    if (user?.role.name === UserRole.BANK) {
        return (
            <div className="max-w-4xl mx-auto px-4">
                <Card className="bg-white/50 p-8 shadow-lg">
                    <div className="space-y-6">
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-[#f5ebdd] rounded-full flex items-center justify-center mx-auto mb-4">
                                <SearchCheck className="w-8 h-8 text-ejaar-green"/>
                            </div>
                            <h2 className="text-2xl font-bold text-ejaar-700 mb-2">Vérification des documents</h2>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Veuillez vérifier les documents soumis par le client.
                            </p>
                        </div>


                        <div className="mt-8 space-y-6">
                            {uploadState.sections.map((section) => (
                                <FileUploadSection
                                    key={section.id}
                                    section={section}
                                    quotationId={quotation.id}
                                    isValidationHidden={false}
                                    isDeleteHidden={true}
                                />
                            ))}
                        </div>
                            <div>
                                <Button
                                    size="sm"
                                    disabled={quotation.status !== QuotationStatusEnum.SENT_TO_BANK}
                                    className="bg-ejaar-green hover:bg-ejaar-greenHover text-white"
                                    onClick={() => {setIsBankValidationDialogOpen(true)} }
                                >
                                    <Check className="mr-2 h-4 w-4"/>
                                    Valider et soumettre le contrat
                                </Button>
                            </div>
                        <BankValidationDialog
                            open={isBankValidationDialogOpen}
                            onOpenChange={setIsBankValidationDialogOpen}
                            quotationId={quotation.id}
                        />

                    </div>
                </Card>

            </div>
        );
    }

    // Original view for CLIENT/SUPPLIER
    return (
        <div className="max-w-4xl mx-auto px-4">
            <Card className="bg-white/50 p-8 text-center shadow-lg">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-[#f5ebdd] rounded-full flex items-center justify-center">
                        <SearchCheck className="w-8 h-8 text-ejaar-green"/>
                    </div>
                    <h2 className="text-2xl font-bold text-ejaar-700">Dossier en cours de vérification</h2>
                    <p className="text-gray-600 max-w-md">
                        Votre dossier est actuellement en cours de vérification par notre équipe.
                        Vous serez notifié une fois la validation terminée.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-lg">
                        <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-ejaar-green"/>
                                <span className="text-sm font-medium text-ejaar-green">Documents reçus</span>
                            </div>
                            <p className="text-sm text-ejaar-700">
                                Tous les documents requis ont été téléchargés avec succès.
                            </p>
                        </div>

                        <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-5 h-5 text-ejaar-red"/>
                                <span className="text-sm font-medium text-ejaar-red">En vérification</span>
                            </div>
                            <p className="text-sm text-ejaar-700">
                                Délai estimé: 2-3 jours ouvrables.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 w-full space-y-6">
                        {getRectifiableSections(uploadState).length > 0 &&
                            <div className="w-full mt-8 text-left">
                                <h3 className="text-lg font-semibold text-ejaar-red mb-4">
                                    Documents à rectifier
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Les documents suivants nécessitent des corrections. Veuillez les mettre à jour.
                                </p>
                            </div>
                        }
                        {getRectifiableSections(uploadState).map((section) => (
                            <div className="w-full"
                                 key={section.id}>
                                <FileUploadSection
                                    section={section}
                                    quotationId={quotation.id}
                                    isValidationHidden={false}
                                    isDeleteHidden={true}
                                    isRectification={true}
                                    onRectifFile={onRectifFile}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </Card>
        </div>
    );
}
