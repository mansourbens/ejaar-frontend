import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {fetchWithToken} from "@/lib/utils";
import {useToast} from "@/hooks/use-toast";

export enum CategorieCA {
    MOINS_DE_5M = 'Moins de 5 000 000 dhs',
    ENTRE_5M_ET_10M = 'Entre 5 000 000 dhs et 10 000 000 dhs',
    ENTRE_10M_ET_20M = 'Entre 10 000 000 dhs et 20 000 000 dhs',
    ENTRE_20M_ET_50M = 'Entre 20 000 000 dhs et 50 000 000 dhs',
    PLUS_DE_50M = 'Plus de 50 000 000 dhs'
}

export interface TauxLoyer {
    tauxBanque: number;
    spread: number;
}

export interface TauxLoyerMapping {
    [categorieCA: string]: TauxLoyer;
}

export const CATEGORIES_ORDER = [
    CategorieCA.MOINS_DE_5M,
    CategorieCA.ENTRE_5M_ET_10M,
    CategorieCA.ENTRE_10M_ET_20M,
    CategorieCA.ENTRE_20M_ET_50M,
    CategorieCA.PLUS_DE_50M
];

const getTauxLoyer = async (): Promise<TauxLoyerMapping> => {
    const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/rate-config`);
    const backendData = await response.json();
    return backendToFrontendMapping(backendData);
};

const updateTauxLoyer = async (data: TauxLoyerMapping): Promise<void> => {
    await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/rate-config/bulk-update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

const getCommercialRate = async (): Promise<number> => {
    const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/commercial-margin/1`);
    const data = await response.json();
    return data.rate;
};

const updateCommercialRate = async (rate: number): Promise<void> => {
    await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/commercial-margin/1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rate }),
    });
};

function backendToFrontendMapping(backendData: Array<{
    categorieCA: string;
    tauxBanque: number;
    spread: number;
}>): TauxLoyerMapping {
    return backendData.reduce((acc, item) => {
        acc[item.categorieCA] = {
            tauxBanque: item.tauxBanque,
            spread: item.spread
        };
        return acc;
    }, {} as TauxLoyerMapping);
}

export const RateConfig = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCommercialRateLoading, setIsCommercialRateLoading] = useState(false);
    const [tauxLoyer, setTauxLoyer] = useState<TauxLoyerMapping>();
    const [commercialRate, setCommercialRate] = useState<number>(0);
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [tauxLoyerData, commercialRateData] = await Promise.all([
                    getTauxLoyer(),
                    getCommercialRate()
                ]);
                setTauxLoyer(tauxLoyerData);
                setCommercialRate(commercialRateData);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Erreur lors du chargement des données",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (
        categorie: CategorieCA,
        field: 'tauxBanque' | 'spread',
        value: string
    ) => {
        setTauxLoyer((prev = {}) => {
            const previousEntry = prev[categorie] || { tauxBanque: 0, spread: 0 };
            return {
                ...prev,
                [categorie]: {
                    ...previousEntry,
                    [field]: parseFloat(value) || 0,
                },
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            if(!tauxLoyer) return;
            await updateTauxLoyer(tauxLoyer);
            toast({
                title: "Succès",
                description: "Taux de loyer enregistrés avec succès",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors de l'enregistrement des taux",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommercialRateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsCommercialRateLoading(true);
            await updateCommercialRate(commercialRate);
            toast({
                title: "Succès",
                description: "Taux de marge commerciale enregistré avec succès",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors de l'enregistrement du taux",
                variant: "destructive",
            });
        } finally {
            setIsCommercialRateLoading(false);
        }
    };

    if (!tauxLoyer) return <div>Chargement...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto h-full space-y-6">
            <Card>
                <CardHeader className="bg-ejaar-800 text-white">
                    <CardTitle>Configuration des taux de loyer</CardTitle>
                    <CardDescription className="text-ejaar-100">
                        Configurez les taux banque et spread par catégorie de CA
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CA du client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Taux Banque (%)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Spread (%)
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {CATEGORIES_ORDER.map(categorie => (
                                    <tr key={categorie}>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-blue-900 lato-bold">
                                            {categorie}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                                value={tauxLoyer[categorie]?.tauxBanque || 0}
                                                onChange={(e) => handleChange(categorie, 'tauxBanque', e.target.value)}
                                                className="w-24 border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500"
                                            />
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                                value={tauxLoyer[categorie]?.spread || 0}
                                                onChange={(e) => handleChange(categorie, 'spread', e.target.value)}
                                                className="w-24 border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                type="submit"
                                className="bg-ejaar-800 hover:bg-ejaar-900 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="bg-ejaar-800 text-white">
                    <CardTitle>Configuration du taux de marge commerciale</CardTitle>
                    <CardDescription className="text-ejaar-100">
                        Définissez le taux de marge commerciale global
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleCommercialRateSubmit} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="commercialRate" className="flex-shrink-0">
                                Taux de marge commerciale (%)
                            </Label>
                            <Input
                                id="commercialRate"
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={commercialRate}
                                onChange={(e) => setCommercialRate(parseFloat(e.target.value) || 0)}
                                className="w-24 border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-ejaar-800 hover:bg-ejaar-900 text-white"
                                disabled={isCommercialRateLoading}
                            >
                                {isCommercialRateLoading ? "Enregistrement..." : "Enregistrer le taux"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
