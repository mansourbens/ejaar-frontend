"use client";

import React, {useEffect, useMemo, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {FileDown, FileSearch, FileText, MoreVertical, Search} from 'lucide-react';
import {Quotation, QuotationStatusEnum} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {useAuth} from "@/components/auth/auth-provider";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import BankFolders from "@/components/bank-folders/bank-folders";

export default function FoldersPage() {
    const {user} = useAuth();
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'signed' | 'unsigned'>('unsigned');
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    const getQuotations = async () => {
        let url;
        if (!user) return;
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
    }, [user]);

    const filteredQuotations = useMemo(() => {
        let filtered = [...quotations];

        // Filter based on active tab
        switch (statusFilter) {
            case 'unsigned':
                filtered = filtered.filter(quote =>
                    quote.status === QuotationStatusEnum.VALIDE &&
                    quote.contract?.signed === false
                );
                break;
            case 'signed':
                filtered = filtered.filter(quote =>
                    quote.status === QuotationStatusEnum.VALIDE &&
                    quote.contract?.signed === true
                );
                break;
            default:
                filtered = filtered.filter(quote =>
                    quote.status === QuotationStatusEnum.VALIDE &&
                    quote.contract?.signed === false
                );
                break;
            // 'all' case shows all three statuses by default
        }

        // Filter by search term if exists
        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    }, [searchTerm, statusFilter]);

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

    const getStatusBadgeColor = (signed?: boolean) => {
        switch (signed) {
            case false:
                return `bg-yellow-100 text-yellow-800 hover:bg-yellow-200`;
            default:
                return `bg-green-100 text-green-800 hover:bg-green-200`;
        }
    };
    const getStatusLabel = (signed?: boolean) => {
        switch (signed) {
            case false:
                return 'À signer';
            default:
                return 'Signé';
        }
    };

    const QuotationCard = ({ quotation }: { quotation: Quotation }) => (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/quotations/${quotation.id}`)}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-4">
                        <h3 className="font-medium text-lg">{quotation.number}</h3>
                        <Badge className={`${getStatusBadgeColor(quotation.contract?.signed)} capitalize`}>
                            {getStatusLabel(quotation.contract?.signed)}
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownloadPDF(+quotation.id); }}>
                                <FileDown className="w-4 h-4 mr-2" />
                                Télécharger le devis
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                            <p>{quotation.client?.fullName ?? '—'}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (

        <MainLayout>
                <div className="space-y-6 px-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl text-ejaar-700 md:text-5xl font-bold leading-tight lg:leading-tight lato-bold">
                                {user?.role.name === UserRole.CLIENT && `Mes ` } Contrats
                            </h1>
                            <p className="text-2xl text-justify text-ejaar-800 max-w-xl lat-bold">
                                Gérez et suivez tous vos contrats de location de matériel.
                            </p>
                        </div>
                    </div>

                    <Card className="bg-white/50 rounded-2xl">
                        <CardContent className="pt-6">
                            {/* Tabs Section */}
                            <div className="flex flex-col space-y-4 mb-4">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setStatusFilter('unsigned')}
                                        className={`py-2 px-4 font-medium text-sm border-b-2 ${statusFilter === 'unsigned' ? 'border-ejaar-red text-ejaar-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Contrats à signer
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('signed')}
                                        className={`py-2 px-4 font-medium text-sm border-b-2 ${statusFilter === 'signed' ? 'border-ejaar-red text-ejaar-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Contrats signés
                                    </button>

                                </div>
                                {/* Search Bar */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Search className="h-5 w-5 text-blue-400"/>
                                    </div>
                                    <Input
                                        placeholder="Rechercher dossier ..."
                                        className="pl-10 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Cards View */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paginatedQuotations.length === 0 ? (
                                    <div className="col-span-full text-center py-8">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <FileSearch className="h-10 w-10 text-blue-300"/>
                                            <p className="text-gray-500">Aucun dossier trouvé</p>
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
        </MainLayout>
    );
}
