"use client";

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {FileDown, FileSearch, FileText, MoreVertical, Plus, Search} from 'lucide-react';
import {Quotation} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {useAuth} from "@/components/auth/auth-provider";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";


export default function FoldersPage() {
    const {user} = useAuth();
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const router = useRouter();

    enum QuotationStatusEnum {
        GENERE = 'Généré',
        VALIDE_CLIENT = 'Validé client',
        VERIFICATION = 'En cours de vérification',
        VALIDE = 'Validé',
        SENT_TO_BANK = 'Envoyé à la banque'
    }

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
                        <h1 className="text-2xl font-bold tracking-tight">Vérification</h1>
                        <p className="text-muted-foreground">
                            Vérifiez tous les dossiers en cours d'examen.
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
                                placeholder="Rechercher dossier ..."
                                className="pl-10 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Accordion
                            type="multiple"
                            defaultValue={["verification"]}
                            className="w-full space-y-4" // Added space between accordion items
                        >


                            {/* En vérification Panel */}
                            <AccordionItem
                                value="verification"
                                className="border border-blue-50 rounded-lg overflow-hidden bg-blue-50 transition-all"
                            >
                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full bg-amber-500"></div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-900">En Vérification</h3>
                                            <p className="text-sm text-amber-600">En cours d'examen</p>
                                        </div>
                                        {user?.role.name === UserRole.SUPER_ADMIN &&
                                            <Badge className="ml-auto bg-amber-500 hover:bg-amber-600">
                                                {quotations.filter(q => q.status === QuotationStatusEnum.VERIFICATION).length}
                                            </Badge>
                                        }

                                        {user?.role.name === UserRole.BANK &&
                                            <Badge className="ml-auto bg-amber-500 hover:bg-amber-600">
                                                {quotations.filter(q => q.status === QuotationStatusEnum.SENT_TO_BANK).length}
                                            </Badge>
                                        }
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 pb-0">
                                    <div className="border-t border-blue-200">
                                        {quotations
                                            .filter(q => q.status === (user?.role.name === UserRole.SUPER_ADMIN && QuotationStatusEnum.VERIFICATION) ||
                                                (user?.role.name === UserRole.BANK && QuotationStatusEnum.SENT_TO_BANK))
                                            .filter(q => searchTerm === '' ||
                                                q.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                q.supplier?.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .length === 0 ? (
                                            <div className="py-12 text-center">
                                                <FileSearch className="mx-auto h-10 w-10 text-blue-300"/>
                                                <h4 className="mt-4 font-medium text-blue-900">Aucun devis généré</h4>
                                                <p className="mt-1 text-sm text-blue-600">Tous les devis générés
                                                    apparaîtront ici</p>
                                            </div>
                                        ) : (
                                            <Table>
                                                <TableHeader className="bg-blue-50">
                                                    <TableRow>
                                                        <TableHead className="text-blue-800">Numéro</TableHead>
                                                        <TableHead className="text-blue-800">Date</TableHead>
                                                        {user?.role.name != UserRole.CLIENT && (
                                                            <>
                                                                <TableHead
                                                                    className="text-blue-800">Fournisseur</TableHead>
                                                                <TableHead className="text-blue-800">Client</TableHead>
                                                            </>
                                                        )}
                                                        <TableHead
                                                            className="text-right text-blue-800">Montant</TableHead>
                                                        <TableHead
                                                            className="hidden md:table-cell text-blue-800">Durée</TableHead>

                                                        <TableHead className="text-blue-800">Statut</TableHead>
                                                        <TableHead
                                                            className="text-right text-blue-800">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {quotations
                                                        .filter(q =>  (user?.role.name === UserRole.SUPER_ADMIN && q.status === QuotationStatusEnum.VERIFICATION) ||
                                                            (user?.role.name === UserRole.BANK && q.status === QuotationStatusEnum.SENT_TO_BANK))
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

                                                                    {expandedRows[quotation.id] && (
                                                                        <div className="mt-3 ml-2">
                                                                            {/* Status Timeline */}
                                                                            <div className="relative pt-4 pb-6">
                                                                                {/* Timeline line */}
                                                                                <div
                                                                                    className="absolute left-4 top-6 h-1 w-[calc(100%-2rem)] bg-gray-200"></div>

                                                                                {/* Timeline items */}
                                                                                <div
                                                                                    className="flex justify-between relative z-10">
                                                                                    {/* Generated */}
                                                                                    <div
                                                                                        className="flex flex-col items-center">
                                                                                        <div
                                                                                            className={`w-4 h-4 rounded-full ${
                                                                                                quotation.status === QuotationStatusEnum.GENERE ?
                                                                                                    'bg-blue-600 ring-2 ring-blue-300' :
                                                                                                    'bg-gray-300'
                                                                                            }`}></div>
                                                                                        <span
                                                                                            className="text-xs mt-1 text-gray-600">Généré</span>
                                                                                    </div>

                                                                                    {/* Middle label */}
                                                                                    <div
                                                                                        className="absolute left-1/4 top-0 transform -translate-x-1/2 text-xs text-gray-500">
                                                                                        1 jour
                                                                                    </div>

                                                                                    {/* Client Validated */}
                                                                                    <div
                                                                                        className="flex flex-col items-center">
                                                                                        <div
                                                                                            className={`w-4 h-4 rounded-full ${
                                                                                                quotation.status === QuotationStatusEnum.VALIDE_CLIENT ?
                                                                                                    'bg-green-600 ring-2 ring-green-300' :
                                                                                                    quotation.status === QuotationStatusEnum.GENERE ?
                                                                                                        'bg-gray-300' :
                                                                                                        'bg-green-300'
                                                                                            }`}></div>
                                                                                        <span
                                                                                            className="text-xs mt-1 text-gray-600">Validé client</span>
                                                                                    </div>

                                                                                    {/* Middle label */}
                                                                                    <div
                                                                                        className="absolute left-3/4 top-0 transform -translate-x-1/2 text-xs text-gray-500">
                                                                                        2 jours
                                                                                    </div>

                                                                                    {/* Verification */}
                                                                                    <div
                                                                                        className="flex flex-col items-center">
                                                                                        <div
                                                                                            className={`w-4 h-4 rounded-full ${
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
                                                                            {((quotation.status === QuotationStatusEnum.VERIFICATION && user?.role.name === UserRole.SUPER_ADMIN) ||
                                                                                (quotation.status === QuotationStatusEnum.SENT_TO_BANK && user?.role.name === UserRole.BANK) ||
                                                                                (quotation.status === QuotationStatusEnum.VALIDE_CLIENT && user?.role.name === UserRole.CLIENT)) && (
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


                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
