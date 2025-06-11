// src/components/CommercialMarginConfig.tsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fetchWithToken } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CommercialMargin {
    tauxMargeCommerciale: number;
}

const getCommercialMargin = async (): Promise<CommercialMargin> => {
    const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/commercial-margin`);
    return await response.json();
};

const updateCommercialMargin = async (taux: number): Promise<void> => {
    await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/commercial-margin`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tauxMargeCommerciale: taux }),
    });
};

export const CommercialMarginConfig = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tauxMarge, setTauxMarge] = useState<number>(0);
    const { toast } = useToast();

    useEffect(() => {
        const loadCommercialMargin = async () => {
            try {
                setIsLoading(true);
                const data = await getCommercialMargin();
                console.log(data);
                setTauxMarge(data.tauxMargeCommerciale);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Erreur lors du chargement du taux de marge commerciale",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadCommercialMargin();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await updateCommercialMargin(tauxMarge);
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
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full ">
            <Card>
                <CardHeader className="bg-ejaar-800 text-white">
                    <CardTitle>Configuration du taux de marge commerciale</CardTitle>
                    <CardDescription className="text-ejaar-100">
                        Configurez le taux de marge commerciale
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 mt-4">
                            <div className="grid grid-cols-4 items-center gap-4 ">
                                <Label htmlFor="tauxMarge" className="text-right ">
                                    Taux de marge commerciale (%)
                                </Label>
                                <Input
                                    id="tauxMarge"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={tauxMarge}
                                    onChange={(e) => setTauxMarge(parseFloat(e.target.value) || 0)}
                                    className="col-span-1 border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500"
                                />
                            </div>
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
        </div>
    );
};
