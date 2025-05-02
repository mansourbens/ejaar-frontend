"use client";

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Plus, Search, Filter, FileDown} from 'lucide-react';
import {Quotation} from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {useAuth} from "@/components/auth/auth-provider";

export default function QuotationsPage() {
    const {user} = useAuth();
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getQuotations = async() => {
        const response =  await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations`);
        const quotations =  await response.json();
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
                quote.hardwareType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quote.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(quote => quote.status === statusFilter);
        }

        setFilteredQuotations(filtered);
    }, [searchTerm, statusFilter, quotations]);

    const handleDownloadPDF = (quotation: Quotation) => {

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
                            Gérez et suivez tous vos devis de location de matériel.
                        </p>
                    </div>
                    { user?.role.name == UserRole.CLIENT &&
                        <Link href="/quotations/new">
                        <Button className="bg-ejaar-800 hover:bg-ejaar-600">
                            <Plus className="mr-2 h-4 w-4"/> Nouveau devis
                        </Button>
                    </Link>
                    }
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative grow">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Recherche devis..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex-shrink-0 w-full md:w-48">
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filtrer par statut"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="waiting">En attente</SelectItem>
                                        <SelectItem value="approved">Accepté</SelectItem>
                                        <SelectItem value="rejected">Rejeté</SelectItem>
                                        <SelectItem value="completed">Complet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Fournisseur</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead className="hidden md:table-cell">Durée</TableHead>
                                        <TableHead className="text-right">Mensualité</TableHead>
                                        <TableHead className="text-right">Montant</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredQuotations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                Aucun résultat.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredQuotations.map((quotation) => (
                                            <TableRow key={quotation.id}>
                                                <TableCell className="font-medium">
                                                    {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                                </TableCell>
                                                <TableCell>{quotation.supplier.raisonSociale}</TableCell>
                                                <TableCell>{quotation.client.raisonSociale}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {quotation.duration} mois
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {quotation.totalAmount.toLocaleString('fr-FR', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })} DH
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`${getStatusBadgeColor(quotation.status)} capitalize`}>
                                                        {quotation.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleDownloadPDF(quotation)}
                                                            title="Download PDF"
                                                        >
                                                            <FileDown className="h-4 w-4"/>
                                                        </Button>
                                                        <Link href={`/quotations/${quotation.id}`}>
                                                            <Button className="bg-ejaar-800 hover:bg-ejaar-600" size="sm">Visualiser</Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
