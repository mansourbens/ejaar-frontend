import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {fetchWithToken} from "@/lib/utils";
import {useToast} from "@/hooks/use-toast";

interface ResidualValueMapping {
    [device: string]: {
        [duration: string]: number;
    };
}
function backendToFrontendMapping(backendData: Array<{
    device: string;
    months24: string;
    months36: string;
}>): ResidualValueMapping {
    //desired sort order
    const sortOrder = [
        'Workstation',
        'Ordinateur portable',
        'Ecran',
        'Smartphone',
        'Serveur',
        'Système de stockage',
        'Imprimante',
        'Scanner',
        'Équipement réseau',
        'Autre'
    ];
    const sortOrderMap = new Map(sortOrder.map((device, index) => [device, index]));
    const sortedData = [...backendData].sort((a, b) => {
        const aOrder = sortOrderMap.get(a.device) ?? sortOrder.length; // Put unknown devices before "Autre"
        const bOrder = sortOrderMap.get(b.device) ?? sortOrder.length;
        return aOrder - bOrder;
    });
    return sortedData.reduce((acc, item) => {
        acc[item.device] = {
            months24: parseFloat(item.months24),
            months36: parseFloat(item.months36)
        };
        return acc;
    }, {} as ResidualValueMapping);
}
const DEFAULT_MAPPING: ResidualValueMapping = {
    "Workstation": { "months24": 10, "months36": 5 },
    "Ordinateur portable": { "months24": 10, "months36": 5 },
    "Ecran": { "months24": 10, "months36": 5 },
    "Smartphone": { "months24": 10, "months36": 5 },
    "Serveur": { "months24": 10, "months36": 5 },
    "Système de stockage": { "months24": 10, "months36": 5 },
    "Imprimante": { "months24": 5, "months36": 1 },
    "Scanner": { "months24": 5, "months36": 1 },
    "Équipement réseau": { "months24": 5, "months36": 1 },
    "Autre": { "months24": 5, "months36": 1 }
};

const DURATIONS = ["months24", "months36"];

const ResidualConfig = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mapping, setMapping] = useState<ResidualValueMapping>(DEFAULT_MAPPING);
    const { toast } = useToast();

    useEffect(() => {
        const loadMapping = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/residual-config`);
                const fetchedMapping = await response.json();
                setMapping(backendToFrontendMapping(fetchedMapping));
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Erreur lors du chargement des valeurs résiduelles",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadMapping();
    }, []);

    const handleChange = (device: string, duration: string, value: string) => {
        setMapping(prev => ({
            ...prev,
            [device]: {
                ...prev[device],
                [duration]: parseFloat(value) || 0
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/residual-config/bulk-update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mapping),
            });

            if (res.ok) {
                toast({
                    title: "Succès",
                    description: "Valeurs résiduelles enregistrées avec succès",
                });
            } else {
                toast({
                    title: "Erreur",
                    description: "Erreur lors de l'enregistrement des valeurs résiduelles",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors de l'enregistrement des valeurs résiduelles",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRow = () => {
        const newEquipment = prompt("Entrez le nom du nouveau matériel:");
        if (newEquipment && !mapping[newEquipment]) {
            setMapping(prev => ({
                ...prev,
                [newEquipment]: DURATIONS.reduce((acc, duration) => {
                    acc[duration] = 0;
                    return acc;
                }, {} as {[duration: string]: number})
            }));
        } else if (newEquipment) {
            toast({
                title: "Attention",
                description: "Ce matériel existe déjà",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="bg-white/50">
                <CardHeader className="bg-ejaar-700 text-white">
                    <CardTitle>Configuration des valeurs résiduelles</CardTitle>
                    <CardDescription className="text-ejaar-100">
                        Configurez les valeurs résiduelles en % par matériel et durée
                    </CardDescription>
                </CardHeader>
                {isLoading ? <></> :
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit}>
                            <div className="overflow-x-auto max-h-[60vh] overflow-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Matériel
                                        </th>
                                        {DURATIONS.map(duration => (
                                            <th key={duration} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {duration.replace(/\D/g, '')} mois
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="bg-transparent divide-y divide-gray-200">
                                    {Object.entries(mapping).map(([equipment, values]) => (
                                        <tr key={equipment}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {equipment}
                                            </td>
                                            {DURATIONS.map(duration => (
                                                <td key={`${equipment}-${duration}`} className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="100"
                                                            value={values[duration]}
                                                            onChange={(e) => handleChange(equipment, duration, e.target.value)}
                                                            className="w-20 border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500"
                                                        />
                                                        <span className="ml-1 text-sm text-gray-500">%</span>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <Button
                                    type="submit"
                                    className="bg-ejaar-red hover:bg-ejaar-redHover text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>

                }
            </Card>
        </div>
    );
};

export default ResidualConfig;
