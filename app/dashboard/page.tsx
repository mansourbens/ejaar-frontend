"use client";

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ArrowRight, Clock, FileCheck, FileClock, FilePen as FilePending, Plus} from 'lucide-react';
import {Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {useAuth} from '@/components/auth/auth-provider';
import MainLayout from "@/components/layouts/main-layout";
import {fetchWithToken, UserRole} from "@/lib/utils";
import {Quotation} from "@/lib/mock-data";

export default function Dashboard() {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [stats, setStats] = useState({
    totalQuotations: 0,
    pendingQuotations: 0,
    approvedQuotations: 0,
  });
  enum QuotationStatusEnum {
    GENERE= 'Généré',
    VALIDE_CLIENT = 'Validé client',
    VERIFICATION = 'En cours de vérification',
    VALIDE = 'Validé'
  }
  const getQuotations = async() => {
    const response =  await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/quotations`);
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
    getQuotations();

  }, []);

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
      <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          </div>
          { user?.role.name == UserRole.CLIENT &&
              <Link href="/quotations/new">
                <Button className="bg-ejaar-800 hover:bg-ejaar-700">
                  <Plus className="mr-2 h-4 w-4" /> Nouveau devis
                </Button>
              </Link>
          }

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
              <FilePending className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle>Activité des devis</CardTitle>
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
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{quotation.duration} mois</p>
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
  );
}
