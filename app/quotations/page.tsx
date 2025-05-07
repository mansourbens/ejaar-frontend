"use client";

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {
    CheckCircle,
    CheckCircle2Icon,
    CircleXIcon,
    FileDown,
    FileText,
    Info,
    MoreVertical,
    Plus,
    Search
} from 'lucide-react';
import {Quotation} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {useAuth} from "@/components/auth/auth-provider";
import {useToast} from "@/hooks/use-toast";
import {usePathname, useRouter} from "next/navigation";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Textarea} from "@/components/ui/textarea";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";


export default function QuotationsPage() {
    const {user} = useAuth();
    const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeQuote, setActiveQuote] = useState<Quotation | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const router = useRouter();
    const pathname = usePathname();

    enum QuotationStatusEnum {
        GENERE = 'Généré',
        REJECTED = 'Refusé',
        VALIDE_CLIENT = 'Validé client',
        VERIFICATION = 'En cours de vérification',
        VALIDE = 'Validé'
    }

    const handleRejection = async () => {
        const quotationId = activeQuote?.id;
        setActiveQuote(null);

        setIsLoading(true);
        try {
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/reject/${quotationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({reason : rejectionReason})
            });

            if (!response.ok) {
                throw new Error('Failed to refuse quotation');
            }

            toast({
                title: 'Succes',
                description: "Devis refusé.",
            });
            setIsRejectDialogOpen(false);
            getQuotations();
        } catch (error) {
            toast({
                title: 'Erreur',
                description: "Erreur lors du refus du devis. Veuillez réessayer.",
                variant: 'destructive',
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleValidate = async () => {
        const quotationId = activeQuote?.id;
        setActiveQuote(null);

        setIsLoading(true);
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
            router.push(`/folders/${quotationId}/validate`)
        } catch (error) {
            toast({
                title: 'Erreur',
                description: "Erreur lors de la validation du devis. Veuillez réessayer.",
                variant: 'destructive',
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getQuotations = async () => {
        let url;
        if (user?.role.name === UserRole.CLIENT) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/client/${user.id}`
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/quotations`
        }
        const response = await fetchWithToken(url);
        const quotations = await response.json();
        setQuotations(quotations);
        setFilteredQuotations(quotations);
    }
    useEffect(() => {
        getQuotations();
    }, []);

    useEffect(() => {
        // Filter quotations based on search term and status filter
        let filtered = [...quotations];

        if (searchTerm) {
            filtered = filtered.filter(quote =>
                quote.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(quote => quote.status === statusFilter);
        }

        setFilteredQuotations(filtered);
    }, [searchTerm, statusFilter, quotations]);

    const handleDownloadPDF = async (quotationId: number) => {
        try {
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/${quotationId}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `devis-${quotationId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error('Failed to download quotation');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'waiting':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Devis</h1>
                        <p className="text-muted-foreground">
                            Gérez et suivez tous vos dossiers de location de matériel.
                        </p>
                    </div>
                    {user?.role.name == UserRole.CLIENT &&
                        <Link href="/quotations/new">
                            <Button className="bg-ejaar-800 hover:bg-ejaar-600">
                                <Plus className="mr-2 h-4 w-4"/> Nouveau devis
                            </Button>
                        </Link>
                    }
                </div>

                <Card>
                    <CardContent className="pt-6">
                        {/* Search Bar with Blue Accent */}
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-blue-400"/>
                            </div>
                            <Input
                                placeholder="Rechercher devis..."
                                className="pl-10 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Table>
                            <TableHeader className="bg-blue-50">
                                <TableRow>
                                    <TableHead className="text-blue-800">Numéro de devis</TableHead>
                                    <TableHead className="text-blue-800">Types de matériel</TableHead>
                                    <TableHead className="text-blue-800">Date de demande</TableHead>
                                    {user?.role.name != UserRole.CLIENT && (
                                        <>
                                            <TableHead className="text-blue-800">Client</TableHead>
                                            {user?.role.name === UserRole.SUPER_ADMIN && (
                                                <TableHead className="text-blue-800">Fournisseur</TableHead>
                                            )}
                                        </>
                                    )}
                                    <TableHead className="text-right text-blue-800">Montant</TableHead>
                                    <TableHead className="hidden md:table-cell text-blue-800">Durée</TableHead>
                                    <TableHead className="text-right text-blue-800">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotations
                                    .filter(q => q.status === QuotationStatusEnum.GENERE || q.status === QuotationStatusEnum.REJECTED)
                                    .filter(q => searchTerm === '' ||
                                        q.client?.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((quotation) => (
                                        <TableRow key={quotation.id} className="bg-gray-50">
                                            <TableCell className="font-medium">

                                                {quotation.status === QuotationStatusEnum.REJECTED && <Badge
                                                    className={`bg-red-100 text-red-800 hover:bg-red-200 capitalize mr-2`}>
                                                    Refusé
                                                </Badge>}
                                                {quotation.number}
                                            </TableCell> <TableCell className="font-medium">
                                            <TableCell>
                                                {quotation.devices?.split(',').map((type, index) => (
                                                    <Badge key={index} className="mr-1 text-xs p-1.5 bg-ejaar-400 hover:bg-ejaar-400 cursor-default">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </TableCell>
                                        </TableCell>
                                            <TableCell className="font-medium">
                                                {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                            </TableCell>
                                            {user?.role.name != UserRole.CLIENT && (
                                                <>
                                                    <TableCell>{quotation.supplier?.raisonSociale}</TableCell>
                                                    <TableCell>{quotation.client?.raisonSociale}</TableCell>
                                                </>
                                            )}
                                            <TableCell className="text-right">
                                                {quotation.amount?.toLocaleString('fr-FR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })} DH
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {quotation.duration} mois
                                            </TableCell>

                                            {/*
                                            <TableCell>
                                                <div
                                                    className="cursor-pointer flex items-center gap-2"
                                                    onClick={() => {
                                                        // Toggle expanded state for this row
                                                        setExpandedRows(prev => ({
                                                            ...prev,
                                                            [quotation.id]: !prev[quotation.id]
                                                        }));
                                                    }}
                                                >
                                                    <Badge
                                                        className={`${getStatusBadgeColor(quotation.status)} capitalize`}>
                                                        {quotation.status}
                                                    </Badge>
                                                    {expandedRows[quotation.id] ? (
                                                        <ChevronUp className="h-4 w-4 text-blue-500"/>
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-blue-500"/>
                                                    )}
                                                </div>

                                                {expandedRows[quotation.id] && (
                                                    <div className="mt-3 ml-2">
                                                         Status Timeline
                                                        <div className="relative pt-4 pb-6">
                                                             Timeline line
                                                            <div
                                                                className="absolute left-4 top-6 h-1 w-[calc(100%-2rem)] bg-gray-200"></div>

                                                             Timeline items
                                                            <div className="flex justify-between relative z-10">
                                                                 Generated
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`w-4 h-4 rounded-full ${
                                                                        quotation.status === QuotationStatusEnum.GENERE ?
                                                                            'bg-blue-600 ring-2 ring-blue-300' :
                                                                            'bg-gray-300'
                                                                    }`}></div>
                                                                    <span
                                                                        className="text-xs mt-1 text-gray-600">Généré</span>
                                                                </div>

                                                                 Middle label
                                                                <div
                                                                    className="absolute left-1/4 top-0 transform -translate-x-1/2 text-xs text-gray-500">
                                                                    1 jour
                                                                </div>

                                                                 Client Validated
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`w-4 h-4 rounded-full ${
                                                                        quotation.status === QuotationStatusEnum.VALIDE_CLIENT ?
                                                                            'bg-green-600 ring-2 ring-green-300' :
                                                                            quotation.status === QuotationStatusEnum.GENERE ?
                                                                                'bg-gray-300' :
                                                                                'bg-green-300'
                                                                    }`}></div>
                                                                    <span className="text-xs mt-1 text-gray-600">Validé client</span>
                                                                </div>

                                                                 Middle label
                                                                <div
                                                                    className="absolute left-3/4 top-0 transform -translate-x-1/2 text-xs text-gray-500">
                                                                    2 jours
                                                                </div>

                                                                 Verification
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`w-4 h-4 rounded-full ${
                                                                        quotation.status === QuotationStatusEnum.VERIFICATION ?
                                                                            'bg-amber-600 ring-2 ring-amber-300' :
                                                                            ['GENERE', 'VALIDE_CLIENT'].includes(quotation.status) ?
                                                                                'bg-gray-300' :
                                                                                'bg-amber-300'
                                                                    }`}></div>
                                                                    <span
                                                                        className="text-xs mt-1 text-gray-600">Vérification</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
*/}
                                            <TableCell className="justify-end flex gap-2">
                                                {quotation.status === QuotationStatusEnum.GENERE &&
                                                <TooltipProvider>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="inline-flex items-center cursor-pointer text-blue-600 hover:text-blue-800">
                                                            <Info className="w-4 h-4" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-white text-sm text-gray-900 shadow-md border border-gray-200 rounded px-3 py-1.5">
                                                        5 jours restants pour la validité du devis
                                                    </TooltipContent>
                                                </Tooltip>
                                                </TooltipProvider>
                                                }


                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="icon" title="Actions">
                                                            <MoreVertical className="h-4 w-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => handleDownloadPDF(+quotation.id)}>
                                                            <FileDown className="w-4 h-4 mr-2"/>
                                                            Télécharger
                                                        </DropdownMenuItem>

                                                        {
                                                            user?.role.name === UserRole.CLIENT && quotation.status === QuotationStatusEnum.GENERE && (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActiveQuote(quotation);
                                                                            setIsValidateDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <CheckCircle2Icon className="w-4 h-4 mr-2"/>
                                                                        Valider
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActiveQuote(quotation);
                                                                            setIsRejectDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <CircleXIcon className="w-4 h-4 mr-2"/>
                                                                        Refuser
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>
            </div>
            <Dialog open={isValidateDialogOpen} onOpenChange={setIsValidateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-blue-100 shadow-xl">

                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-50">
                                <FileText className="h-5 w-5 text-blue-600"/>
                            </div>
                            <DialogTitle className="text-blue-900 text-lg font-semibold">
                                Validation du devis N°{activeQuote?.number}
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
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-red-100 shadow-xl">

                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-50">
                                <FileText className="h-5 w-5 text-red-600"/>
                            </div>
                            <DialogTitle className="text-red-900 text-lg font-semibold">
                                Refus du devis N°{activeQuote?.number}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="py-4 px-2">
                            <Textarea
                                id="rejection-reason"
                                placeholder="Expliquez la raison du refus"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="border-red-900"
                            />
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectDialogOpen(false)}
                            className="border-gray-700 text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleRejection}
                            className="bg-red-900 hover:bg-red-800 text-white shadow-sm"
                        >
                            <CheckCircle className="mr-2 h-4 w-4"/>
                            Confirmer le refus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </MainLayout>
    );
}
