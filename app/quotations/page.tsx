"use client";

import React, {useEffect, useMemo, useState} from 'react';
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
    Search,
    Settings2
} from 'lucide-react';
import {Quotation, QuotationStatusEnum} from '@/lib/mock-data';
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeQuote, setActiveQuote] = useState<Quotation | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const pathname = usePathname();
    const pageSize = 5;
    const filteredQuotations = useMemo(() => {
        let filtered = [...quotations];

        // Filter by status

        // Filter by search term if exists
        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.client?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [quotations, searchTerm]);
    const { paginatedQuotations, totalPages } = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const paginated = filteredQuotations.slice(startIndex, startIndex + pageSize);
        const total = Math.ceil(filteredQuotations.length / pageSize);

        return { paginatedQuotations: paginated, totalPages: total };
    }, [filteredQuotations, currentPage]);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    const handleDelete = async () => {
        const quotationId = activeQuote?.id;
        setActiveQuote(null);

        setIsLoading(true);
        try {
            const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations/${quotationId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete quotation');
            }

            toast({
                title: 'Succès',
                description: "Devis annulé avec succès.",
                variant: 'success',
            });
            setIsDeleteDialogOpen(false);
            getQuotations();
        } catch (error) {
            toast({
                title: 'Erreur',
                description: "Erreur lors de l'annulation du devis. Veuillez réessayer.",
                variant: 'destructive',
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
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
    }
    useEffect(() => {
        getQuotations();
    }, []);

    useEffect(() => {
        // Filter quotations based on search term and status filter
        let filtered = [...quotations];

        if (searchTerm) {
            filtered = filtered.filter(quote =>
                quote.number?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(quote => quote.status === statusFilter);
        }

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
            <div className="space-y-6 px-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl text-ejaar-700 md:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight lato-bold">
                            {user?.role.name === UserRole.CLIENT && `Mes ` } Devis
                        </h1>

                        <p className="text-2xl text-justify text-ejaar-800 max-w-xl lat-bold">
                            Gérez et suivez tous vos devis de location de matériel.
                        </p>
                    </div>
                </div>

                <Card className="bg-white/50 rounded-2xl">
                    <CardContent className="pt-6">
                        {/* Search Bar with Blue Accent */}
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-blue-400" />
                            </div>
                            <Input
                                placeholder="Rechercher devis..."
                                className="pl-10 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Table Container with Scroll */}
                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-ejaar-700">
                                    <TableRow className="hover:bg-ejaar-700">
                                        <TableHead className="text-ejaar-beige">Numéro de devis</TableHead>
                                        <TableHead className="text-ejaar-beige">Types de matériel</TableHead>
                                        <TableHead className="text-ejaar-beige">Date de demande</TableHead>
                                        {user?.role.name != UserRole.CLIENT && (
                                            <>
                                                <TableHead className="text-ejaar-beige">Client</TableHead>
                                                {user?.role.name === UserRole.SUPER_ADMIN && (
                                                    <TableHead className="text-ejaar-beige">Fournisseur</TableHead>
                                                )}
                                            </>
                                        )}
                                        <TableHead className="text-right text-ejaar-beige">
                                            {user?.role.name === UserRole.SUPER_ADMIN ? 'Montant financé' : 'Montant'}
                                        </TableHead>
                                        <TableHead className="text-right text-ejaar-beige">Mensualité</TableHead>
                                        <TableHead className="text-right text-ejaar-beige">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paginatedQuotations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={user?.role.name === UserRole.SUPER_ADMIN ? 8 : 6} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <FileText className="h-10 w-10 text-gray-400" />
                                                    <p className="text-gray-500">Aucun devis trouvé</p>
                                                    {searchTerm && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setSearchTerm('')}
                                                            className="text-ejaar-800   "
                                                        >
                                                            Effacer la recherche
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedQuotations.map((quotation) => (


                                            <TableRow className="hover:bg-blue-100/50 cursor-pointer"
                                            onClick={() => router.push(`/quotations/`+quotation.id)} >
                                                <TableCell className="font-medium">
                                                    {quotation.status === QuotationStatusEnum.REJECTED && (
                                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 capitalize mr-2">
                                                            Refusé
                                                        </Badge>
                                                    )}
                                                    {quotation.number}
                                                </TableCell>

                                                <TableCell>
                                                    {quotation.devices?.split(',').map((type, index) => (
                                                        <Badge
                                                            key={index}
                                                            className="mr-1 text-xs p-1.5 bg-ejaar-800 hover:bg-ejaar-800 cursor-default"
                                                        >
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </TableCell>

                                                <TableCell>
                                                    {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                                </TableCell>

                                                {user?.role.name != UserRole.CLIENT && (
                                                    <>
                                                        <TableCell>{quotation.supplier?.raisonSociale ?? '—'}</TableCell>
                                                        <TableCell>{quotation.client?.raisonSociale ?? '—'}</TableCell>
                                                    </>
                                                )}

                                                <TableCell className="text-right">
                                                    {quotation.amount?.toLocaleString('fr-FR', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })} DH
                                                </TableCell>

                                                    <TableCell className="text-right">
                                                        {quotation.totalMonthlyPayments?.toLocaleString('fr-FR', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }) ?? 0} DH
                                                    </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {quotation.status === QuotationStatusEnum.GENERE && (
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
                                                        )}

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="icon" title="Actions">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleDownloadPDF(+quotation.id)}>
                                                                    <FileDown className="w-4 h-4 mr-2" />
                                                                    Télécharger
                                                                </DropdownMenuItem>
                                                                {user?.role.name === UserRole.SUPER_ADMIN && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActiveQuote(quotation);
                                                                            setIsDeleteDialogOpen(true);
                                                                        }}
                                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                    >
                                                                        <CircleXIcon className="w-4 h-4 mr-2" />
                                                                        Annuler
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {user?.role.name === UserRole.CLIENT && quotation.status === QuotationStatusEnum.GENERE && (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                setActiveQuote(quotation);
                                                                                setIsValidateDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <CheckCircle2Icon className="w-4 h-4 mr-2" />
                                                                            Valider
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                setActiveQuote(quotation);
                                                                                setIsRejectDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <CircleXIcon className="w-4 h-4 mr-2" />
                                                                            Refuser
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                                )
                                        ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                {filteredQuotations.length} résultats
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Précédent
                                </Button>
                                <span className="flex items-center justify-center px-4 text-sm">
          Page {currentPage} sur {totalPages}
        </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Suivant
                                </Button>
                            </div>
                        </div>
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
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-red-100 shadow-xl">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-50">
                                <CircleXIcon className="h-5 w-5 text-red-600"/>
                            </div>
                            <DialogTitle className="text-red-900 text-lg font-semibold">
                                Annulation du devis N°{activeQuote?.number}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="py-4 px-2">
                        <p className="text-sm text-gray-700">
                            Êtes-vous sûr de vouloir annuler définitivement ce devis? Cette action est irréversible.
                        </p>
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setActiveQuote(null); setIsDeleteDialogOpen(false)}}
                            className="border-gray-700 text-gray-700 hover:bg-gray-50"
                            >
                            Non
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-900 hover:bg-red-800 text-white shadow-sm"
                        >
                            Oui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
