"use client";

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  ArrowRight,
  ChartBar,
  Clock,
  DollarSign,
  FileCheck,
  FileClock,
  FilePen,
  FileText,
  TrendingUp
} from 'lucide-react';
import {Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {useAuth} from '@/components/auth/auth-provider';
import MainLayout from "@/components/layouts/main-layout";
import {fetchWithToken, formatCurrency, UserRole} from "@/lib/utils";
import {Quotation, QuotationStatusEnum} from "@/lib/mock-data";
import Loader from "@/components/ui/loader";
import DashboardMetricCard from "@/components/dashboard/dashboard-metric-card";
import {Switch} from "@/components/ui/switch";
import FinancingBreakdown from "@/components/dashboard/financing-break-down";
import DashboardTaskList from "@/components/dashboard/dashboard-task-list";
import {redirect} from "next/navigation";

const mockStats = {
  pendingClientValidation: 8,
  incompleteFiles: 15,
  completedAwaitingReview: 12,
  totalFinancingAmount: 5250000,
  monthlyProduction: 1850000
};

// Mock data for the financing breakdown
const mockFinancingData = {
  devisAmount: 1850000,
  dossierAmount: 2200000,
  contratAmount: 1200000,
};

// Mock data - replace with real data fetching logic
const mockQuotations = [
  { id: '001', number: 'QT-2025-001', clientName: 'Société A', amount: 450000, status: 'En attente de validation', createdAt: '2025-05-08T10:30:00' },
  { id: '002', number: 'QT-2025-002', clientName: 'Entreprise B', amount: 320000, status: 'Dossier incomplet', createdAt: '2025-05-06T14:15:00' },
  { id: '003', number: 'QT-2025-003', clientName: 'Compagnie C', amount: 710000, status: 'Validé, en attente de revue', createdAt: '2025-05-05T09:45:00' },
  { id: '004', number: 'QT-2025-004', clientName: 'Agence D', amount: 275000, status: 'Contrat à établir', createdAt: '2025-05-03T16:20:00' },
  { id: '005', number: 'QT-2025-005', clientName: 'Groupe E', amount: 530000, status: 'Financé', createdAt: '2025-05-01T11:10:00' },
];

// Monthly production data with both amount and number of dossiers
const monthlyProductionData = [
  { month: 'Jan', montant: 1200000, nombreDossiers: 8 },
  { month: 'Fév', montant: 1450000, nombreDossiers: 10 },
  { month: 'Mar', montant: 1650000, nombreDossiers: 12 },
  { month: 'Avr', montant: 1750000, nombreDossiers: 14 },
  { month: 'Mai', montant: 1850000, nombreDossiers: 15 },
  { month: 'Jun', montant: 0, nombreDossiers: 0 }, // Projected
];

const financingDistributionData = [
  { name: 'En attente de validation', value: mockStats.pendingClientValidation, color: '#3B82F6' },
  { name: 'Dossiers incomplets', value: mockStats.incompleteFiles, color: '#F59E0B' },
  { name: 'En attente de revue', value: mockStats.completedAwaitingReview, color: '#10B981' },
  { name: 'Financés', value: 20, color: '#6366F1' }
];

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#6366F1'];
export default function Dashboard() {
  const { user } = useAuth();
  const [showAmount, setShowAmount] = useState(true);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [stats, setStats] = useState({
    totalQuotations: 0,
    pendingQuotations: 0,
    approvedQuotations: 0,
  });
  const getQuotations = async() => {
    let url;
    if (user?.role.name === UserRole.CLIENT) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/client/${user.id}`
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/quotations`
    }
    const response =  await fetchWithToken(url);
    const quotations =  await response.json() as Quotation[];
    const total = quotations.length;
    const pending = quotations.filter(quote => quote.status === QuotationStatusEnum.GENERE).length;
    const approved = quotations.filter(quote => quote.status === QuotationStatusEnum.VALIDE_CLIENT).length;
    setQuotations(quotations);
    setStats({
      totalQuotations: total,
      pendingQuotations: pending,
      approvedQuotations: approved,
    });
  }
  useEffect(() => {
    if (user?.role.name === UserRole.BANK) {
      redirect('/folders')
    }
    getQuotations();

  }, [user]);

  // Activity data for bar chart
  const activityData = [
    { name: 'Jan', value: 5 },
    { name: 'Fév', value: 8 },
    { name: 'Mar', value: 12 },
    { name: 'Avr', value: 7 },
    { name: 'Mai', value: 10 },
    { name: 'Jun', value: 15 },
  ];

  // Status distribution for pie chart
  const statusData = [
    { name: 'En attente', value: stats.pendingQuotations },
    { name: 'Validé', value: stats.approvedQuotations },
    { name: 'Clôturé', value: stats.totalQuotations - stats.pendingQuotations - stats.approvedQuotations },
  ];

  const COLORS = ['#ffc658', '#82ca9d', '#8884d8'];

  return (
      <>
       { !user ?           (

               <div className="min-h-screen flex flex-col items-center justify-center p-4">

                 <div className="h-48 bg-gray-50 rounded-lg mb-6 flex items-center justify-center">

                   <Loader size={100} color="#53769b" />
                 </div>
               </div>


           )
            : (<>
             {user?.role.name === UserRole.SUPER_ADMIN ?
             <MainLayout>
               <div className="min-h-screen p-6">

                 <header className="mb-8">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                     <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                       <div>
                         <h1 className="text-2xl font-bold text-blue-900">Tableau de bord EJAAR</h1>
                       </div>
                     </div>
                   </div>
                 </header>

                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                   <DashboardMetricCard
                       title="Devis en attente de validation"
                       value={mockStats.pendingClientValidation}
                       description="+3 depuis la semaine dernière"
                       icon={<Clock className="h-6 w-6 text-blue-600" />}
                       trend={10}
                       bgColor="bg-blue-50"
                       borderColor="border-blue-200"
                   />
                   <DashboardMetricCard
                       title="Dossiers incomplets"
                       value={mockStats.incompleteFiles}
                       description="Nécessitant une action du client"
                       icon={<FilePen className="h-6 w-6 text-amber-600" />}
                       trend={-5}
                       bgColor="bg-amber-50"
                       borderColor="border-amber-200"
                   />
                   <DashboardMetricCard
                       title="Dossiers complétés à revoir"
                       value={mockStats.completedAwaitingReview}
                       description="En attente d'analyse par l'équipe"
                       icon={<FileCheck className="h-6 w-6 text-emerald-600" />}
                       trend={20}
                       bgColor="bg-emerald-50"
                       borderColor="border-emerald-200"
                   />
                     <DashboardMetricCard
                         title="Montant total à financer"
                         value={formatCurrency(mockStats.totalFinancingAmount)}
                         description="Total des devis approuvés"
                         icon={<DollarSign className="h-6 w-6 text-indigo-600" />}
                         trend={15}
                         bgColor="bg-indigo-50"
                         borderColor="border-indigo-200"
                     />
                 </div>

                 <div className="grid gap-6 lg:grid-cols-3 mb-6">
                   <Card className="border-blue-200 shadow-md lg:col-span-2">
                     <CardHeader className="flex flex-row items-center justify-between">
                       <div>
                         <CardTitle className="text-blue-800">Production Mensuelle</CardTitle>
                         <CardDescription>
                           {showAmount ? "Montant total financé par mois (en MAD)" : "Nombre de dossiers par mois"}
                         </CardDescription>
                       </div>
                       <div className="flex items-center space-x-2">
                         <span className="text-sm text-blue-700">Nombre</span>
                         <Switch
                             checked={showAmount}
                             onCheckedChange={setShowAmount}
                         />
                         <span className="text-sm text-blue-700">Montant</span>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={monthlyProductionData} margin={{ top: 20, right: 30, left: 30, bottom: 10 }}>
                             <XAxis dataKey="month" />
                             <YAxis
                                 tickFormatter={(value) =>
                                     showAmount ? `${value / 1000000}M` : `${value}`
                                 }
                             />
                             <Tooltip
                                 formatter={(value) => [
                                   showAmount ? formatCurrency(value as number) : `${value} dossiers`,
                                   showAmount ? "Montant" : "Dossiers"
                                 ]}
                                 labelFormatter={(label) => `Mois: ${label}`}
                             />
                             <Legend />
                             <Bar
                                 name={showAmount ? "Montant financé" : "Nombre de dossiers"}
                                 dataKey={showAmount ? "montant" : "nombreDossiers"}
                                 fill="#3B82F6"
                                 radius={[4, 4, 0, 0]}
                             />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </CardContent>
                     <CardFooter className="text-sm text-blue-600 flex justify-between items-center">
                       <div className="flex items-center">
                         <ChartBar className="h-4 w-4 mr-2" />
                         {showAmount
                             ? `Production du mois: ${formatCurrency(mockStats.monthlyProduction)}`
                             : `Dossiers du mois: 15`
                         }
                       </div>
                       <div className="flex items-center text-emerald-600">
                         <TrendingUp className="h-4 w-4 mr-1" />
                         +12% par rapport au mois précédent
                       </div>
                     </CardFooter>
                   </Card>

                   <div className="lg:col-span-1">
                     <FinancingBreakdown
                         devisAmount={mockFinancingData.devisAmount}
                         dossierAmount={mockFinancingData.dossierAmount}
                         contratAmount={mockFinancingData.contratAmount}
                     />
                   </div>
                 </div>

                 <Tabs defaultValue="pending" className="space-y-4">
                   <TabsList className="bg-blue-100 border border-blue-200">
                     <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                       En attente de validation
                     </TabsTrigger>
                     <TabsTrigger value="incomplete" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                       Dossiers incomplets
                     </TabsTrigger>
                     <TabsTrigger value="review" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                       À examiner
                     </TabsTrigger>
                   </TabsList>

                   <TabsContent value="pending">
                     <DashboardTaskList
                         title="Devis en attente de validation client"
                         description="Ces devis nécessitent une validation de la part du client"
                         items={mockQuotations.filter(q => q.status === 'En attente de validation')}
                         emptyMessage="Aucun devis en attente de validation client"
                         statusColor="bg-blue-100 text-blue-600"
                         icon={<Clock className="h-5 w-5" />}
                     />
                   </TabsContent>

                   <TabsContent value="incomplete">
                     <DashboardTaskList
                         title="Dossiers incomplets à compléter"
                         description="Ces dossiers nécessitent des informations supplémentaires du client"
                         items={mockQuotations.filter(q => q.status === 'Dossier incomplet')}
                         emptyMessage="Aucun dossier incomplet à traiter"
                         statusColor="bg-amber-100 text-amber-600"
                         icon={<FilePen className="h-5 w-5" />}
                     />
                   </TabsContent>

                   <TabsContent value="review">
                     <DashboardTaskList
                         title="Dossiers complétés à examiner"
                         description="Ces dossiers sont complets et attendent une revue de l'équipe EJAAR"
                         items={mockQuotations.filter(q => q.status === 'Validé, en attente de revue')}
                         emptyMessage="Aucun dossier à examiner"
                         statusColor="bg-emerald-100 text-emerald-600"
                         icon={<FileCheck className="h-5 w-5" />}
                     />
                   </TabsContent>
                 </Tabs>

                 <div className="mt-8">
                   <Card className="border-blue-200 shadow-md">
                     <CardHeader className="flex flex-row items-center justify-between">
                       <div>
                         <CardTitle className="text-blue-800">Actions prioritaires</CardTitle>
                         <CardDescription>
                           Dossiers nécessitant une intervention rapide
                         </CardDescription>
                       </div>
                       <Link href="/quotations">
                         <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                           Voir tous les dossiers
                           <ArrowRight className="ml-2 h-4 w-4" />
                         </Button>
                       </Link>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4">
                         {mockQuotations.slice(0, 4).map((quotation) => (
                             <div
                                 key={quotation.id}
                                 className="flex items-center justify-between p-4 border border-blue-100 rounded-lg transition-colors hover:bg-blue-50"
                             >
                               <div className="flex items-center space-x-4">
                                 <div className={`p-2 rounded-full ${
                                     quotation.status === 'En attente de validation'
                                         ? 'bg-blue-100 text-blue-600'
                                         : quotation.status === 'Dossier incomplet'
                                             ? 'bg-amber-100 text-amber-600'
                                             : quotation.status === 'Validé, en attente de revue'
                                                 ? 'bg-emerald-100 text-emerald-600'
                                                 : 'bg-indigo-100 text-indigo-600'
                                 }`}>
                                   <FileText className="h-5 w-5" />
                                 </div>
                                 <div>
                                   <p className="font-medium">{quotation.number}</p>
                                   <p className="text-sm text-blue-700">
                                     {quotation.clientName}
                                   </p>
                                 </div>
                               </div>
                               <div className="flex items-center space-x-4">
                                 <div>
                                   <p className="font-medium text-right">{formatCurrency(quotation.amount)}</p>
                                   <p className="text-sm text-blue-600">
                                     {quotation.status}
                                   </p>
                                 </div>
                                 <Link href={`/quotations/${quotation.id}`}>
                                   <Button variant="ghost" size="icon" className="hover:bg-blue-100 text-blue-600">
                                     <ArrowRight className="h-4 w-4" />
                                   </Button>
                                 </Link>
                               </div>
                             </div>
                         ))}
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </MainLayout> :
                 <MainLayout>
                   <div className="space-y-6">
                     <div className="flex items-center justify-between">
                       <div>
                         <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
                       </div>

                     </div>

                     <div className="grid gap-4 md:grid-cols-3">
                       <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Total des devis</CardTitle>
                           <FileClock className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold">{stats.totalQuotations}</div>
                           <p className="text-xs text-muted-foreground">
                             +20% par rapport au mois dernier
                           </p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Devis en attente</CardTitle>
                           <FilePen className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold">{stats.pendingQuotations}</div>
                           <p className="text-xs text-muted-foreground">
                             +5% par rapport au mois dernier
                           </p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Devis approuvés</CardTitle>
                           <FileCheck className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold">{stats.approvedQuotations}</div>
                           <p className="text-xs text-muted-foreground">
                             +12% par rapport au mois dernier
                           </p>
                         </CardContent>
                       </Card>
                     </div>

                     <Tabs defaultValue="activity" className="space-y-4">
                       <TabsList>
                         <TabsTrigger value="activity">Activité</TabsTrigger>
                         <TabsTrigger value="status">Répartition par statut</TabsTrigger>
                       </TabsList>
                       <TabsContent value="activity" className="space-y-4">
                         <Card>
                           <CardHeader>
                             <CardTitle>Demandes des devis</CardTitle>
                             <CardDescription>
                               Nombre de devis créés au cours des 6 derniers mois.
                             </CardDescription>
                           </CardHeader>
                           <CardContent>
                             <div className="h-80">
                               <ResponsiveContainer width="100%" height="100%">
                                 <BarChart
                                     data={activityData}
                                     margin={{
                                       top: 20,
                                       right: 30,
                                       left: 20,
                                       bottom: 10,
                                     }}
                                 >
                                   <XAxis dataKey="name" />
                                   <YAxis />
                                   <Tooltip
                                   />
                                   <Bar
                                       dataKey="value"
                                       fill="hsl(var(--chart-1))"
                                       radius={[4, 4, 0, 0]}
                                   />
                                 </BarChart>
                               </ResponsiveContainer>
                             </div>
                           </CardContent>
                         </Card>
                       </TabsContent>
                       <TabsContent value="status" className="space-y-4">
                         <Card>
                           <CardHeader>
                             <CardTitle>Répartition par statut des devis</CardTitle>
                             <CardDescription>
                               Vue d'ensemble de vos devis par statut.
                             </CardDescription>
                           </CardHeader>
                           <CardContent>
                             <div className="h-80 flex items-center justify-center">
                               <ResponsiveContainer width="100%" height="100%">
                                 <PieChart>
                                   <Pie
                                       data={statusData}
                                       cx="50%"
                                       cy="50%"
                                       innerRadius={60}
                                       outerRadius={100}
                                       paddingAngle={5}
                                       dataKey="value"
                                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                   >
                                     {statusData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                   </Pie>
                                 </PieChart>
                               </ResponsiveContainer>
                             </div>
                           </CardContent>
                         </Card>
                       </TabsContent>
                     </Tabs>

                     <Card>
                       <CardHeader className="flex flex-row items-center">
                         <div>
                           <CardTitle>Devis récents</CardTitle>
                           <CardDescription>
                             Vos dernières demandes de devis.
                           </CardDescription>
                         </div>
                       </CardHeader>
                       <CardContent>
                         <div className="space-y-4">
                           {quotations.slice(0, 5).map((quotation) => (
                               <div
                                   key={quotation.id}
                                   className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                               >
                                 <div className="flex items-center space-x-4">
                                   <div className={`p-2 rounded-full ${
                                       quotation.status === QuotationStatusEnum.GENERE
                                           ? 'bg-yellow-100 text-yellow-600'
                                           : quotation.status ===  QuotationStatusEnum.VALIDE
                                               ? 'bg-green-100 text-green-600'
                                               : 'bg-blue-100 text-blue-600'
                                   }`}>
                                     <FileText className="h-5 w-5" />
                                   </div>
                                   <div>
                                     <p className="font-medium">N° {quotation.number}</p>
                                     <p className="text-sm text-muted-foreground">
                                       {new Date(quotation.createdAt).toLocaleDateString('fr-FR')}
                                     </p>
                                   </div>
                                 </div>
                                 <div className="flex items-center space-x-4">
                                   <div>
                                     <p className="font-medium text-right">{quotation.amount?.toLocaleString('fr-FR'
                                     )} DH</p>
                                     <p className="text-sm text-muted-foreground capitalize">
                                       {quotation.status}
                                     </p>
                                   </div>
                                   <Link href={`/quotations/${quotation.id}`}>
                                     <Button variant="ghost" size="icon">
                                       <ArrowRight className="h-4 w-4" />
                                     </Button>
                                   </Link>
                                 </div>
                               </div>
                           ))}
                         </div>
                         <div className="mt-4 flex justify-center">
                           <Link href="/quotations">
                             <Button variant="outline">
                               Voir tous les devis
                               <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                           </Link>
                         </div>
                       </CardContent>
                     </Card>
                   </div>
                 </MainLayout>
             }
           </>

            )}
      </>

  );
}
