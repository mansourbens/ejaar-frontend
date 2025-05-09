import {useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {CONFIG_CONSTANTS, DEFAULT_VALUES} from "@/components/ejaar-settings/calculation-constants";
import {ConfigConstantsFormData} from "@/app/settings/types";
import {fetchWithToken} from "@/lib/utils";
import {useToast} from "@/hooks/use-toast";

const EjaarConfig = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ConfigConstantsFormData>({
        residualValuePercentage: DEFAULT_VALUES.residualValuePercentage,
        financingSpreadAnnual: DEFAULT_VALUES.financingSpreadAnnual,
        leaserFinancingRateAnnual: DEFAULT_VALUES.leaserFinancingRateAnnual,
        fileFeesPercentage: DEFAULT_VALUES.fileFeesPercentage,
    });
    const {toast} = useToast();

    useEffect(() => {
        const loadConstants = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/calculation-rates/1`);
                const fetchedConstants = await response.json()
                setFormData(fetchedConstants);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Erreur lors du chargement des constantes",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadConstants();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        try {
            const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/calculation-rates/1`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            setIsLoading(true);
            console.log(res.ok);
            if (res.ok) {
                toast({
                    title: "Succès",
                    description: "Configuration enregistrée avec succès",
                });
            } else {
                toast({
                    title: "Erreur",
                    description: "Erreur lors du chargement des constantes",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors du chargement des constantes",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card>
                <CardHeader className="bg-ejaar-800 text-white">
                    <CardTitle>Configuration des constantes</CardTitle>
                    <CardDescription className="text-ejaar-100">
                        Configurez les constantes utilisées dans la simulation de leasing
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {CONFIG_CONSTANTS.map((constant) => (
                                <div key={constant.id} className="grid gap-2">
                                    <Label htmlFor={constant.id}>{constant.name}</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id={constant.id}
                                            name={constant.id}
                                            type="number"
                                            step="0.01"
                                            min={constant.min}
                                            max={constant.max}
                                            value={formData[constant.id as keyof ConfigConstantsFormData]}
                                            onChange={handleChange}
                                            className="border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500"
                                        />
                                        <span className="text-sm text-gray-500">%</span>
                                    </div>
                                    {constant.description && (
                                        <p className="text-sm text-gray-500">{constant.description}</p>
                                    )}
                                </div>
                            ))}

                            <Button
                                type="submit"
                                className="bg-ejaar-800 hover:bg-ejaar-700 text-white w-full mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EjaarConfig;
