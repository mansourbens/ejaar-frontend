"use client";

import React, {useEffect, useMemo, useState} from 'react';
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
    Grid,
    Info,
    List,
    MoreVertical,
    Search
} from 'lucide-react';
import {Quotation, QuotationStatusEnum} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {cn, fetchWithToken, UserRole} from "@/lib/utils";
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
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards'); // Default to cards view
    const {toast} = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const pathname = usePathname();
    const pageSize = viewMode === 'table' ? 5 : 6; // Adjust page size based on view
    const filteredQuotations = useMemo(() => {
        let filtered = [...quotations];

        // Filter by status - now only considering GENERE and REJECTED
        if (statusFilter === QuotationStatusEnum.GENERE) {
            filtered = filtered.filter(quote => quote.status === QuotationStatusEnum.GENERE);
        } else if (statusFilter === QuotationStatusEnum.REJECTED) {
            filtered = filtered.filter(quote => quote.status === QuotationStatusEnum.REJECTED);
        } else {
            filtered = filtered.filter(quote => quote.status === QuotationStatusEnum.REJECTED ||
                quote.status === QuotationStatusEnum.GENERE);
        }

        // Filter by search term if exists
        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.client?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [quotations, searchTerm, statusFilter]);
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

    function getQuotationStatusBadgeColor(status: QuotationStatusEnum): string {
        const baseClasses = "capitalize mt-1";

        switch (status) {
            case QuotationStatusEnum.GENERE:
                return `bg-blue-100 text-blue-800 hover:bg-blue-200 ${baseClasses}`;
            case QuotationStatusEnum.VALIDE_CLIENT:
                return `bg-purple-100 text-purple-800 hover:bg-purple-200 ${baseClasses}`;
            case QuotationStatusEnum.VERIFICATION:
                return `bg-yellow-100 text-yellow-800 hover:bg-yellow-200 ${baseClasses}`;
            case QuotationStatusEnum.SENT_TO_BANK:
                return `bg-indigo-100 text-indigo-800 hover:bg-indigo-200 ${baseClasses}`;
            case QuotationStatusEnum.VALIDE:
                return `bg-green-100 text-green-800 hover:bg-green-200 ${baseClasses}`;
            case QuotationStatusEnum.REJECTED:
                return `bg-red-100 text-red-800 hover:bg-red-200 ${baseClasses}`;
            default:
                return `bg-gray-100 text-gray-800 hover:bg-gray-200 ${baseClasses}`;
        }
    }
    const QuotationCard = ({ quotation }: { quotation: Quotation }) => (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/quotations/`+quotation.id)}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-4 w-full">
                        <h3 className="font-medium text-lg">{quotation.number}</h3>
                            <Badge className={getQuotationStatusBadgeColor(quotation.status)}>
                                {quotation.status}
                            </Badge>
                        <Button
                            onClick={(e) => { e.stopPropagation(); handleDownloadPDF(+quotation.id); }}
                            variant="ghost" size="icon" className="h-8 w-8 text-ejaar-red hover:text-ejaar-redHover ml-auto" >
                            <FileDown className="w-6 h-6 mr-2" />
                        </Button>
                    </div>

                </div>

                <div className="mb-3">
                    {quotation.devices?.split(',').map((type, index) => (
                        <Badge
                            key={index}
                            className="mr-1 mb-1 text-xs p-1.5 bg-ejaar-800 hover:bg-ejaar-800 cursor-default"
                        >
                            {type}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                        <p className="text-gray-500">Date</p>
                        <p>{new Date(quotation.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Montant</p>
                        <p>
                            {quotation.amount?.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} DH
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Mensualité</p>
                        <p>
                            {quotation.totalMonthlyPayments?.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }) ?? 0} DH
                        </p>
                    </div>
                    {user?.role.name !== UserRole.CLIENT && (
                        <div>
                            <p className="text-gray-500">Client</p>
                            <p>{quotation.client?.raisonSociale ?? '—'}</p>
                        </div>
                    )}
                </div>

                {quotation.status === QuotationStatusEnum.GENERE && (
                    <div className="flex items-center text-blue-600 text-sm mt-2">
                        <Info className="w-4 h-4 mr-1" />
                        <span>5 jours restants pour la validité du devis</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
    return (
        <MainLayout>
            <div className="space-y-6 px-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl text-ejaar-700 md:text-5xl font-bold leading-tight lg:leading-tight lato-bold">
                            {user?.role.name === UserRole.CLIENT && `Mes ` } Devis
                        </h1>

                        <p className="text-2xl text-justify text-ejaar-800 max-w-xl lat-bold">
                            Gérez et suivez tous vos devis de location de matériel.
                        </p>
                    </div>
                </div>

                <Card className="bg-white/50 rounded-2xl">
                    <CardContent className="pt-6">
                        {/* Search and View Toggle */}
                        <div className="flex flex-col space-y-4 mb-4">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`py-2 px-4 font-medium text-sm border-b-2 ${statusFilter === 'all' ? 'border-ejaar-red text-ejaar-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Tout
                                </button>
                                <button
                                    onClick={() => setStatusFilter(QuotationStatusEnum.GENERE)}
                                    className={`py-2 px-4 font-medium text-sm border-b-2 ${statusFilter === QuotationStatusEnum.GENERE ? 'border-ejaar-red text-ejaar-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Devis à valider
                                </button>
                                <button
                                    onClick={() => setStatusFilter(QuotationStatusEnum.REJECTED)}
                                    className={`py-2 px-4 font-medium text-sm border-b-2 ${statusFilter === QuotationStatusEnum.REJECTED ? 'border-ejaar-red text-ejaar-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Devis refusés
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                {/* Keep the search and view toggle code here */}
                                <div className="relative w-full max-w-md">
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
{/*
                                <div className="flex space-x-2">
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('table')}
                                        className={cn(viewMode === 'table' ? "bg-ejaar-red hover:bg-ejaar-redHover text-white" : "")}
                                        title="Vue tableau"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'cards' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('cards')}
                                        className={cn(viewMode === 'cards' ? "bg-ejaar-red hover:bg-ejaar-redHover text-white" : "")}
                                        title="Vue cartes"
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                </div>
*/}
                            </div>
                        </div>                        {viewMode === 'table' ? (
                            /* Table View (keep your existing table code) */
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
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            /* Card View */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paginatedQuotations.length === 0 ? (
                                    <div className="col-span-full text-center py-8">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <FileText className="h-10 w-10 text-gray-400" />
                                            <p className="text-gray-500">Aucun devis trouvé</p>
                                            {searchTerm && (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setSearchTerm('')}
                                                    className="text-ejaar-800"
                                                >
                                                    Effacer la recherche
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    paginatedQuotations.map((quotation) => (
                                        <QuotationCard key={quotation.id} quotation={quotation} />
                                    ))
                                )}
                            </div>
                        )}

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
