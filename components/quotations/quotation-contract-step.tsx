import {useRef, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {Card} from "@/components/ui/card";
import {CheckCircle, Download, FileText, Signature, Upload} from "lucide-react";
import {Button} from "@/components/ui/button";

export function QuotationContractStep() {
    const [uploadedContract, setUploadedContract] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();

    const handleDownloadContract = () => {
        // In a real app, this would download the actual contract
        toast({
            title: "Téléchargement",
            description: "Le contrat a été téléchargé avec succès.",
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedContract(file);
            toast({
                title: "Succès",
                description: "Contrat signé téléchargé avec succès.",
            });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Card className="bg-white/50 p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#f5ebdd] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Signature className="w-8 h-8 text-ejaar-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-ejaar-700 mb-2">Contrat prêt</h2>
                    <p className="text-gray-600">
                        Votre dossier a été validé. Téléchargez le contrat, signez-le et renvoyez-le.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Download Contract */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-ejaar-700">1. Télécharger le contrat</h3>
                        <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <Download className="w-5 h-5 text-ejaar-red" />
                                <span className="font-medium text-ejaar-red">Contrat de leasing</span>
                            </div>
                            <p className="text-sm text-ejaar-red mb-4">
                                Téléchargez votre contrat personnalisé, imprimez-le et signez-le.
                            </p>
                            <Button
                                onClick={handleDownloadContract}
                                className="w-full bg-ejaar-red hover:bg-ejaar-redHover text-white"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger le contrat
                            </Button>
                        </div>
                    </div>

                    {/* Upload Signed Contract */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-ejaar-700">2. Renvoyer le contrat signé</h3>
                        <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4">
                            {uploadedContract ? (
                                <div className="text-center">
                                    <CheckCircle className="w-8 h-8 text-ejaar-green mx-auto mb-2" />
                                    <p className="font-medium text-ejaar-green mb-1">Contrat téléchargé</p>
                                    <p className="text-sm text-ejaar-green mb-4">{uploadedContract.name}</p>
                                    <Button
                                        onClick={handleUploadClick}
                                        variant="outline"
                                        className="border-ejaar-green text-ejaar-green hover:bg-ejaar-green hover:text-white"
                                    >
                                        Remplacer le fichier
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-ejaar-green mx-auto mb-2" />
                                    <p className="font-medium text-ejaar-green mb-1">Télécharger le contrat signé</p>
                                    <p className="text-sm text-ejaar-green mb-4">
                                        Formats acceptés: PDF, JPG, PNG
                                    </p>
                                    <Button
                                        onClick={handleUploadClick}
                                        className="w-full bg-ejaar-green hover:bg-ejaar-greenHover text-white"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Sélectionner le fichier
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                />

                {uploadedContract && (
                    <div className="mt-8 text-center">
                        <Button
                            size="lg"
                            className="bg-ejaar-700 hover:bg-ejaar-900 text-white px-8 py-3"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Finaliser le dossier
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
