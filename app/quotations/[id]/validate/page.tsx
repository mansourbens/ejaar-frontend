"use client";

import {useState, useCallback, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Upload,
    File,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {Quotation} from "@/lib/mock-data";
import {fetchWithToken} from "@/lib/utils";
import MainLayout from "@/components/layouts/main-layout";


export default function ValidateQuotationPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [files, setFiles] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [
            ...prevFiles,
            ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                progress: 0
            }))
        ]);
    }, []);
    interface FileWithProgress extends File {
        preview?: string;
        progress?: number;
        error?: string;
        uploaded?: boolean;
    }

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
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxSize: 5242880, // 5MB
    });

    const removeFile = (fileToRemove: FileWithProgress) => {
        setFiles(files => files.filter(file => file !== fileToRemove));
        if (fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
    };

    const uploadFiles = async () => {
        if (files.length === 0) {
            toast({
                title: "Erreur",
                description: "Veuillez sélectionner au moins un fichier à télécharger",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            // Simulate file upload with progress
            for (const file of files) {
                for (let progress = 0; progress <= 100; progress += 10) {
                    setFiles(prevFiles =>
                        prevFiles.map(f =>
                            f === file ? { ...f, progress } : f
                        )
                    );
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                setFiles(prevFiles =>
                    prevFiles.map(f =>
                        f === file ? { ...f, uploaded: true } : f
                    )
                );
            }

            toast({
                title: "Succès",
                description: "Les fichiers ont été téléchargés avec succès",
            });

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/dashboard/quotations');
            }, 1500);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors du téléchargement des fichiers",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (!quotation) {
        return (
            <MainLayout>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h1 className="text-xl font-semibold">Devis non trouvé</h1>
                <p className="text-muted-foreground">
                    Le devis que vous recherchez n'existe pas ou a été supprimé.
                </p>
                <Link href="/dashboard/quotations">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux devis
                    </Button>
                </Link>
            </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/quotations">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Validation du Devis</h1>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            {quotation.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Téléchargez les documents requis pour valider votre devis
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Détails du Devis</CardTitle>
                        <CardDescription>
                            Informations sur le devis à valider
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Numéro du Devis</p>
                                <p className="font-medium">{quotation.id}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Date de Création</p>
                                <p className="font-medium">
                                    {new Date(quotation.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Matériel</p>
                            <p className="font-medium">{quotation.hardwareType}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Montant Total</p>
                            <p className="text-xl font-bold">{quotation.amount.toFixed(2)} €</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Documents Requis</CardTitle>
                        <CardDescription>
                            Formats acceptés: PDF, JPG, PNG (max 5MB par fichier)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                                isDragActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center text-center">
                                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium">
                                    {isDragActive
                                        ? "Déposez les fichiers ici"
                                        : "Glissez-déposez vos fichiers ici"}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    ou cliquez pour sélectionner des fichiers
                                </p>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3 flex-1">
                                            <File className="h-5 w-5 text-primary" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            {file.progress !== undefined && file.progress < 100 && (
                                                <Progress value={file.progress} className="w-20" />
                                            )}
                                            {file.uploaded && (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFile(file)}
                                            disabled={isUploading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    className="w-full mt-4"
                                    onClick={uploadFiles}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Téléchargement en cours...
                                        </>
                                    ) : (
                                        'Valider et Envoyer'
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
        </MainLayout>
    );
}
