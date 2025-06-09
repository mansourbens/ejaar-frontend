import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Check, Upload, X} from 'lucide-react';
import {useToast} from "@/hooks/use-toast";
import {fetchWithTokenWithoutContentType} from "@/lib/utils";
import {redirect, useRouter} from "next/navigation";

interface BankValidationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quotationId: string;
}

export function BankValidationDialog({
                                         open,
                                         onOpenChange,
                                         quotationId,
                                     }: BankValidationDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner un fichier à uploader',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            // Create form data
            const formData = new FormData();
            formData.append('contract', file);
            formData.append('quotationId', quotationId);

            // Call your API endpoint
            const response = await fetchWithTokenWithoutContentType(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts/submit`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Échec de la soumission du contrat');
            }

            toast({
                title: 'Succès',
                description: 'Le contrat a été soumis avec succès',
            });
            onOpenChange(false);
            router.push('/folders');
        } catch (error) {
            console.log(error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la soumission du contrat',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Validation et soumission du contrat</DialogTitle>
                    <DialogDescription>
                        Veuillez uploader le contrat pour signature du client.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contract" className="text-right">
                            Contrat
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="contract"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Formats acceptés: PDF, DOC, DOCX
                            </p>
                        </div>
                    </div>

                    {file && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Upload className="h-4 w-4" />
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFile(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading || !file}
                        className="bg-ejaar-green hover:bg-ejaar-greenHover text-white"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                En cours...
              </span>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Valider et soumettre
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
