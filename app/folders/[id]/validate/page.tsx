"use client";

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {AlertCircle, ArrowLeft, File, FileText, Info, UploadCloud} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {Quotation} from "@/lib/mock-data";
import {fetchWithToken, fetchWithTokenWithoutContentType, UserRole} from "@/lib/utils";
import MainLayout from "@/components/layouts/main-layout";
import FileUploadSection from '@/components/file-upload/file-upload-section';
import {DocumentUploadState, ServerFile, UploadFile} from '@/types/file-upload';
import Loader from "@/components/ui/loader";
import {Badge} from "@/components/ui/badge";
import {useAuth} from "@/components/auth/auth-provider";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";


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

export default function ValidateQuotationPage({params}: { params: { id: string } }) {
    const [uploadState, setUploadState] = useState<DocumentUploadState>(initialState);
    const router = useRouter();
    const {toast} = useToast();
    const [files, setFiles] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contract, setContract] = useState<File | null>(null);
    const [validateFolderOpen, setValidateFolderOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const {user} = useAuth();
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [
            ...prevFiles,
            ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                progress: 0
            }))
        ]);
    }, []);
    const handleClick = () => {
        inputRef.current?.click();
    };
    const handleContractChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setContract(e.target?.files[0]);
        }
    };
    const [loading, setLoading] = useState(true);

    const [documents, setDocuments] = useState<Record<string, any>>([]);
    useEffect(() => {
        const fetchDocuments = async () => {
            if (!quotation) return;
            try {
                const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/quotation/${quotation.id}`);
                if (!response.ok) throw new Error('Failed to fetch documents');
                const serverFiles: ServerFile[] = await response.json();
                quotation.documents = serverFiles;

                setUploadState(prevState => ({
                    sections: prevState.sections.map(section => ({
                        ...section,
                        documentTypes: section.documentTypes.map(docType => {
                            const serverFile = serverFiles.find(f => f.documentType === docType.id);
                            return {
                                ...docType,
                                uploadedFile: serverFile ? {
                                    id: serverFile.id,
                                    file: serverFile,
                                    status: 'success',
                                    progress: 100
                                } : undefined
                            };
                        })
                    }))
                }));
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [quotation]);
    const handleFileUpload = async (sectionId: string, documentTypeId: string, file: UploadFile) => {
        setUploadState(prevState => {
            const newSections = prevState.sections.map(section => {
                if (section.id === sectionId) {
                    const newDocumentTypes = section.documentTypes.map(docType => {
                        if (docType.id === documentTypeId) {
                            return {
                                ...docType,
                                uploadedFile: file
                            };
                        }
                        return docType;
                    });

                    return {
                        ...section,
                        documentTypes: newDocumentTypes
                    };
                }
                return section;
            });

            return {
                ...prevState,
                sections: newSections
            };
        });
        if (!quotation) return;
        if (file.status != 'success') return;
        try {
            const formData = new FormData();
            formData.append('file', file.file as File);
            formData.append('documentType', documentTypeId);
            formData.append('quotationId', quotation.id);

            const response = await fetchWithTokenWithoutContentType(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) throw new Error('Upload failed');

            const serverFile: ServerFile = await response.json();

            setUploadState(prevState => ({
                sections: prevState.sections.map(section => ({
                    ...section,
                    documentTypes: section.documentTypes.map(docType =>
                        docType.id === documentTypeId
                            ? {
                                ...docType,
                                uploadedFile: {
                                    id: serverFile.id,
                                    file: serverFile,
                                    status: 'success',
                                    progress: 100
                                }
                            }
                            : docType
                    )
                }))
            }));
        } catch (error) {
            // ... error handling
        }
    };

    const handleFileRemove = async (sectionId: string, documentTypeId: string) => {
        const docType = uploadState.sections
            .flatMap(s => s.documentTypes)
            .find(d => d.id === documentTypeId);

        if (!docType?.uploadedFile) return;

        try {
            const fileId = docType.uploadedFile.id;
            const response = await fetchWithToken(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload/${fileId}`,
                {method: 'DELETE'}
            );

            if (!response.ok) throw new Error('Delete failed');

            setUploadState(prevState => ({
                sections: prevState.sections.map(section => ({
                    ...section,
                    documentTypes: section.documentTypes.map(docType =>
                        docType.id === documentTypeId
                            ? {...docType, uploadedFile: undefined}
                            : docType
                    )
                }))
            }));
        } catch (error) {
            console.error('Error deleting file:', error);
            toast({
                title: "Erreur",
                description: "Échec de la suppression du fichier",
                variant: "destructive",
            });
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
    };

    const submitDocuments = async () => {
        const response = await fetchWithToken(
            `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/to-verification/${quotation?.id}`
        );
        if (response.ok) {
            toast({
                title: "Succès",
                description: 'Dossier envoyé en vérification',
            })
            router.push('/folders');
        }
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
            router.push('/folders');
        }
    }
    const validateFolder = async () => {
        const response = await fetchWithToken(
            `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/validate-folder/${quotation?.id}`
        );
        if (response.ok) {
            toast({
                title: "Succès",
                description: 'Dossier validé',
            })
            router.push('/folders');
        }
    }

    const totalDocuments = uploadState.sections.reduce(
        (total, section) => total + section.documentTypes.length,
        0
    ) - 1;

    const uploadedDocuments = uploadState.sections.reduce(
        (total, section) => total + section.documentTypes.filter(
            doc => doc.uploadedFile?.status === 'success'
        ).length,
        0
    );

    const progress = Math.round((uploadedDocuments / totalDocuments) * 100);

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
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
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

    if (!quotation) {
        if (isLoading) {
            return (
                <MainLayout>
                    <div className="h-48 bg-gray-50 rounded-lg mb-6 flex items-center justify-center">

                        <Loader size={100} color="#53769b"/>
                    </div>
                </MainLayout>
            )
        }
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <AlertCircle className="h-12 w-12 text-red-500"/>
                    <h1 className="text-xl font-semibold">Devis non trouvé</h1>
                    <p className="text-muted-foreground">
                        Le devis que vous recherchez n'existe pas ou a été supprimé.
                    </p>
                    <Link href="/quotations">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4"/> Retour aux devis
                        </Button>
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Blue Top Banner */}

                <div className="flex flex-col">
                    <Card className="border-blue-100 bg-blue-50">
                        <div className="flex items-start gap-6 p-4">
                            {/* Title Section */}
                            <div className="flex items-center gap-6 min-w-[180px]">
                                <Link href="/folders">
                                    <Button size="sm" className="text-blue-100 bg-ejaar-900 hover:bg-ejaar-800">
                                        <ArrowLeft className="h-4 w-4 mr-1"/>
                                        Retour
                                    </Button>
                                </Link>
                                <FileText className="h-5 w-5 text-ejaar-800"/>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Complétion du dossier</h3>
                                    <p className="text-sm text-gray-600">Téléversez les documents requis pour compléter
                                        votre dossier</p>
                                </div>
                            </div>

                            {/* Details Grid - Moved closer */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 flex-1 ml-4">
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
                                               className="mr-1 mb-1 text-[10px] p-1.5 bg-ejaar-400 hover:bg-ejaar-400 cursor-default">
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-ejaar-800">Montant</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {quotation.amount.toFixed(2)} MAD
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="py-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <header className="mb-8 text-center">
                                <h1 className="text-xl text-blue-900 mb-2 lato-bold">
                                    Documents à fournir pour une demande de leasing
                                </h1>
                                <p className="text-ejaar-800/80 lato-regular text-sm max-w-xl mx-auto">
                                    Veuillez téléverser les documents requis pour compléter votre demande de leasing.
                                    Tous les fichiers doivent être au format PDF, DOC, DOCX, JPG ou PNG.
                                </p>
                            </header>

                            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-blue-900">
                                        Statut de votre dossier
                                    </h2>
                                    <div
                                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {uploadedDocuments} sur {totalDocuments} documents obligatoires téléchargés
                                    </div>
                                </div>

                                <div className="h-2 w-full bg-blue-100 rounded-full mb-6">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                                        style={{width: `${progress}%`}}
                                    ></div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {uploadState.sections.map((section) => (
                                        <FileUploadSection
                                            key={section.id}
                                            section={section}
                                            quotationId={quotation.id}
                                            onFileUpload={handleFileUpload}
                                            onFileRemove={handleFileRemove}
                                        />
                                    ))}

                                    <div className="mt-8 flex justify-between">
                                        <div>
                                            <span className="text-red-600 mr-1">*</span>
                                            <span className="text-sm">Obligatoire</span>
                                        </div>
                                        {user?.role.name === UserRole.CLIENT &&
                                            <div className="flex gap-2">
                                                <Link href="/folders">
                                                    <Button
                                                        className="px-6 py-2 bg-white hover:bg-ejaar-50 border-ejaar-800 border-2 text-ejaar-800"
                                                    >
                                                        Enregistrer pour plus tard
                                                    </Button>
                                                </Link>

                                                <Button
                                                    onClick={submitDocuments}
                                                    type="button"
                                                    className="px-6 py-2 bg-ejaar-900 hover:bg-ejaar-800 text-white"
                                                >
                                                    Soumettre les documents
                                                </Button>
                                            </div>
                                        }
                                        {user?.role.name === UserRole.SUPER_ADMIN &&
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={sendToBank}
                                                    type="button"
                                                    className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white"
                                                >
                                                    Vérifier et envoyer à la banque
                                                </Button>
                                            </div>
                                        }
                                        {user?.role.name === UserRole.BANK &&
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => setValidateFolderOpen(true)}
                                                    type="button"
                                                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white"
                                                >
                                                    Valider
                                                </Button>
                                            </div>
                                        }
                                        <Dialog open={validateFolderOpen} onOpenChange={setValidateFolderOpen}>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Confirmation de validation</DialogTitle>
                                                </DialogHeader>

                                                <div>

                                                    <div className="flex items-start p-4 border border-green-100 rounded-lg bg-green-50 mb-4">
                                                        <Info className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0"/>
                                                        <p className="ml-2 text-sm text-green-700">
                                                            Pour valider le dossier du client, veuillez joindre son contrat.
                                                        </p>
                                                    </div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contrat
                                                        (fichier à joindre)</label>
                                                    <div
                                                        onClick={handleClick}
                                                        className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                                    >
                                                        <UploadCloud className="w-5 h-5 text-gray-500 mr-2"/>
                                                        <span className="text-sm text-gray-600">
                {contract ? contract.name : 'Cliquez ici pour sélectionner un fichier'}
              </span>
                                                    </div>
                                                    <input
                                                        ref={inputRef}
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleContractChanges}
                                                        className="hidden"
                                                    />
                                                </div>

                                                <DialogFooter className="mt-4 flex justify-end gap-2">
                                                    <Button variant="outline"
                                                            onClick={() => setValidateFolderOpen(false)}>Annuler</Button>
                                                    <Button
                                                        onClick={validateFolder}
                                                        disabled={!contract}
                                                        className="bg-green-600 hover:bg-green-500 text-white"
                                                    >
                                                        Valider
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}

