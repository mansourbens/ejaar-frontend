"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {FileDown, FileSearch, FileText, MoreHorizontal, MoreVertical, Plus, Search} from 'lucide-react';
import {Quotation, QuotationStatusEnum} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {useAuth} from "@/components/auth/auth-provider";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {ChevronDown, ChevronUp} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";


export default function FoldersPage() {
    const {user} = useAuth();
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const router = useRouter();

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
        setFilteredQuotations(quotations);
    }
    useEffect(() => {
        getQuotations();
    }, [user]);

    useEffect(() => {
        // Filter quotations based on search term and status filter
        let filtered = [...quotations];

        if (searchTerm) {
            filtered = filtered.filter(quote =>
                quote.number.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h1 className="text-4xl text-ejaar-700 md:text-5xl font-bold leading-tight lg:leading-tight lato-bold">
                            {user?.role.name === UserRole.CLIENT && `Mes ` } Dossiers
                        </h1>

                        <p className="text-2xl text-justify text-ejaar-800 max-w-xl lat-bold">
                            Gérez et suivez tous vos dossiers de location de matériel.
                        </p>
                    </div>
                </div>

                <Card className="bg-white/50">
                    <CardContent className="pt-6">
                        {/* Search Bar with Blue Accent */}
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

                        <Accordion
                            type="multiple"
                            defaultValue={["generated"]}
                            className="w-full space-y-4" // Added space between accordion items
                        >
                            {/* Généré Panel */}
                            <AccordionItem
                                value="generated"
                                className="border rounded-lg overflow-hidden border-[#f7ecde] bg-[#f7ecde] transition-all"
                            >
                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-ejaar-beige">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full bg-ejaar-800"></div>
                                        <div>
                                            <h3 className="text-lg text-left font-semibold text-ejaar-700">En cours de
                                                constitution</h3>
                                            <p className="text-sm text-ejaar-800">En attente de completion par le
                                                client</p>
                                        </div>
                                        <Badge className="ml-auto bg-ejaar-800 hover:bg-ejaar-800">
                                            {quotations.filter(q => q.status === QuotationStatusEnum.VALIDE_CLIENT).length}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 pb-0">
                                    <div className="border-t border-blue-200">
                                        {quotations
                                            .filter(q => q.status === QuotationStatusEnum.VALIDE_CLIENT)
                                            .filter(q => searchTerm === '' ||
                                                q.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .length === 0 ? (
                                            <div className="py-12 text-center">
                                                <FileSearch className="mx-auto h-10 w-10 text-blue-300"/>
                                                <h4 className="mt-4 font-medium text-ejaar-700">Aucun devis généré</h4>
                                                <p className="mt-1 text-sm text-gray-600">Tous les devis générés
                                                    apparaîtront ici</p>
                                            </div>
                                        ) : (
                                            <Table>
                                                <TableHeader className="bg-ejaar-700">
                                                    <TableRow>
                                                        <TableHead className="text-ejaar-beige">Numéro</TableHead>
                                                        <TableHead className="text-ejaar-beige">Date</TableHead>
                                                        {user?.role.name != UserRole.CLIENT && (
                                                            <>
                                                                <TableHead
                                                                    className="text-ejaar-beige">Fournisseur</TableHead>
                                                                <TableHead className="text-ejaar-beige">Client</TableHead>
                                                            </>
                                                        )}
                                                        <TableHead
                                                            className="text-right text-ejaar-beige">Montant</TableHead>
                                                        <TableHead
                                                            className="hidden md:table-cell text-ejaar-beige">Durée</TableHead>

                                                        <TableHead className="text-ejaar-beige">Statut</TableHead>
                                                        <TableHead
                                                            className="text-right text-ejaar-beige">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {quotations
                                                        .filter(q => q.status === QuotationStatusEnum.VALIDE_CLIENT)
                                                        .filter(q => searchTerm === '' ||
                                                            q.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                                        .map((quotation) => (
                                                            <TableRow key={quotation.id} className="bg-gray-50">
                                                                <TableCell className="font-medium">
                                                                    {quotation.number}
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                                                </TableCell>
                                                                {user?.role.name != UserRole.CLIENT && (
                                                                    <>
                                                                        <TableCell>{quotation.supplier?.raisonSociale}</TableCell>
                                                                        <TableCell>{quotation.client?.fullName}</TableCell>
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

                                                                <TableCell>
                                                                    <div
                                                                        className="cursor-pointer flex items-center gap-2"
                                                                    >
                                                                        <Badge
                                                                            className={`${getStatusBadgeColor(quotation.status)} capitalize`}>
                                                                            {quotation.status}
                                                                        </Badge>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <div className="flex justify-end">
                                                                                <Button variant="outline" size="icon" title="Actions">
                                                                                    <MoreVertical className="h-4 w-4"/>
                                                                                </Button>
                                                                            </div>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleDownloadPDF(+quotation.id)}>
                                                                                <FileDown className="w-4 h-4 mr-2"/>
                                                                                Télécharger
                                                                            </DropdownMenuItem>
                                                                            {quotation.status === QuotationStatusEnum.VALIDE_CLIENT && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => router.push(`/folders/${quotation.id}/validate`)}>
                                                                                    <FileText className="w-4 h-4 mr-2"/>
                                                                                    Documents
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* En vérification Panel */}
                            <AccordionItem
                                value="verification"
                                className="border rounded-lg overflow-hidden border-[#f7ecde] bg-[#f7ecde] transition-all"
                            >
                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-ejaar-beige">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full bg-ejaar-redHover"></div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-ejaar-700">En Vérification</h3>
                                            <p className="text-sm text-ejaar-redHover">En cours d'examen</p>
                                        </div>
                                        <Badge className="ml-auto bg-ejaar-redHover hover:bg-ejaar-redHover">
                                            {quotations.filter(q => q.status === QuotationStatusEnum.VERIFICATION).length}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 pb-0">
                                    <div className="border-t border-blue-200">
                                        {quotations
                                            .filter(q => q.status === QuotationStatusEnum.VERIFICATION)
                                            .filter(q => searchTerm === '' ||
                                                q.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .length === 0 ? (
                                            <div className="py-12 text-center">
                                                <FileSearch className="mx-auto h-10 w-10 text-blue-300"/>
                                                <h4 className="mt-4 font-medium text-ejaar-700">Aucun devis généré</h4>
                                                <p className="mt-1 text-sm text-gray-600">Tous les devis générés
                                                    apparaîtront ici</p>
                                            </div>
                                        ) : (
                                            <Table>
                                                <TableHeader className="bg-ejaar-700">
                                                    <TableRow>
                                                        <TableHead className="text-ejaar-beige">Numéro</TableHead>
                                                        <TableHead className="text-ejaar-beige">Date</TableHead>
                                                        {user?.role.name != UserRole.CLIENT && (
                                                            <>
                                                                <TableHead
                                                                    className="text-ejaar-beige">Fournisseur</TableHead>
                                                                <TableHead className="text-ejaar-beige">Client</TableHead>
                                                            </>
                                                        )}
                                                        <TableHead
                                                            className="text-right text-ejaar-beige">Montant</TableHead>
                                                        <TableHead
                                                            className="hidden md:table-cell text-ejaar-beige">Durée</TableHead>

                                                        <TableHead className="text-ejaar-beige">Statut</TableHead>
                                                        <TableHead
                                                            className="text-right text-ejaar-beige">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {quotations
                                                        .filter(q => q.status === QuotationStatusEnum.VERIFICATION)
                                                        .filter(q => searchTerm === '' ||
                                                            q.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                                        .map((quotation) => (
                                                            <TableRow key={quotation.id} className="bg-gray-50">
                                                                <TableCell className="font-medium">
                                                                    {quotation.number}
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                                                </TableCell>
                                                                {user?.role.name != UserRole.CLIENT && (
                                                                    <>
                                                                        <TableCell>{quotation.supplier?.raisonSociale}</TableCell>
                                                                        <TableCell>{quotation.client?.fullName}</TableCell>
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

                                                                <TableCell>
                                                                    <div
                                                                        className="cursor-pointer flex items-center gap-2"
                                                                    >
                                                                        <Badge
                                                                            className={`${getStatusBadgeColor(quotation.status)} capitalize`}>
                                                                            {quotation.status}
                                                                        </Badge>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <div className="flex justify-end">
                                                                                <Button variant="outline" size="icon" title="Actions">
                                                                                    <MoreVertical className="h-4 w-4"/>
                                                                                </Button>
                                                                            </div>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleDownloadPDF(+quotation.id)}>
                                                                                <FileDown className="w-4 h-4 mr-2"/>
                                                                                Télécharger
                                                                            </DropdownMenuItem>
                                                                            {quotation.status === QuotationStatusEnum.VALIDE_CLIENT && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => router.push(`/folders/${quotation.id}/validate`)}>
                                                                                    <FileText className="w-4 h-4 mr-2"/>
                                                                                    Documents
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Validé banque Panel */}
                            <AccordionItem
                                value="validated"
                                className="border rounded-lg overflow-hidden border-[#f7ecde] bg-[#f7ecde] transition-all"
                            >
                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-ejaar-beige">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full bg-[#4a7971]"></div>
                                        <div>
                                            <h3 className="text-lg text-left font-semibold text-ejaar-700">Approuvés par la banque</h3>
                                            <p className="text-sm  text-[#4a7971]">En attente de signature de contrat</p>
                                        </div>
                                        <Badge className="ml-auto  bg-[#4a7971] hover:bg-[#4a7971]">
                                            {quotations.filter(q => q.status === QuotationStatusEnum.VALIDE).length}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 pb-0">
                                    <AccordionContent className="px-0 pb-0">
                                        <div className="border-t border-blue-200">
                                            {quotations
                                                .filter(q => q.status === QuotationStatusEnum.VALIDE)
                                                .filter(q => searchTerm === '' ||
                                                    q.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .length === 0 ? (
                                                <div className="py-12 text-center">
                                                    <FileSearch className="mx-auto h-10 w-10 text-blue-300"/>
                                                    <h4 className="mt-4 font-medium text-ejaar-700">Aucun devis généré</h4>
                                                    <p className="mt-1 text-sm text-gray-600">Tous les devis générés
                                                        apparaîtront ici</p>
                                                </div>
                                            ) : (
                                                <Table>
                                                    <TableHeader className="bg-ejaar-700">
                                                        <TableRow>
                                                            <TableHead className="text-ejaar-beige">Numéro</TableHead>
                                                            <TableHead className="text-ejaar-beige">Date</TableHead>
                                                            {user?.role.name != UserRole.CLIENT && (
                                                                <>
                                                                    <TableHead
                                                                        className="text-ejaar-beige">Fournisseur</TableHead>
                                                                    <TableHead className="text-ejaar-beige">Client</TableHead>
                                                                </>
                                                            )}
                                                            <TableHead
                                                                className="text-right text-ejaar-beige">Montant</TableHead>
                                                            <TableHead
                                                                className="hidden md:table-cell text-ejaar-beige">Durée</TableHead>

                                                            <TableHead className="text-ejaar-beige">Statut</TableHead>
                                                            <TableHead
                                                                className="text-right text-ejaar-beige">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {quotations
                                                            .filter(q => q.status === QuotationStatusEnum.VALIDE)
                                                            .filter(q => searchTerm === '' ||
                                                                q.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                                            .map((quotation) => (
                                                                <TableRow key={quotation.id} className="bg-gray-50">
                                                                    <TableCell className="font-medium">
                                                                        {quotation.number}
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                                                    </TableCell>
                                                                    {user?.role.name != UserRole.CLIENT && (
                                                                        <>
                                                                            <TableCell>{quotation.supplier?.raisonSociale}</TableCell>
                                                                            <TableCell>{quotation.client?.fullName}</TableCell>
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

                                                                    <TableCell>
                                                                        <div
                                                                            className="cursor-pointer flex items-center gap-2"
                                                                        >
                                                                            <Badge
                                                                                className={`${getStatusBadgeColor(quotation.status)} capitalize`}>
                                                                                {quotation.status}
                                                                            </Badge>
                                                                        </div>

                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <div className="flex justify-end">
                                                                                    <Button variant="outline" size="icon" title="Actions">
                                                                                        <MoreVertical className="h-4 w-4"/>
                                                                                    </Button>
                                                                                </div>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end">
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleDownloadPDF(+quotation.id)}>
                                                                                    <FileDown className="w-4 h-4 mr-2"/>
                                                                                    Télécharger
                                                                                </DropdownMenuItem>
                                                                                {quotation.status === QuotationStatusEnum.VALIDE_CLIENT && (
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => router.push(`/folders/${quotation.id}/validate`)}>
                                                                                        <FileText className="w-4 h-4 mr-2"/>
                                                                                        Documents
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionContent>
                            </AccordionItem>


                        </Accordion>

                        {/* Status Legend */}
                        {/*
                        <div className="mt-6 flex flex-wrap gap-4 items-center justify-center text-sm text-blue-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Généré</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Validé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span>En vérification</span>
                            </div>
                        </div>
*/}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
