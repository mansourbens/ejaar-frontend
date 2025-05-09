import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {performCalculations} from './calculations';
import {DEFAULT_VALUES, DURATION_OPTIONS} from "@/components/ejaar-settings/calculation-constants";
import {SimulationResults} from "@/app/settings/types";
import {fetchWithToken} from "@/lib/utils";

const EjaarSimulator = () => {
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [durationMonths, setDurationMonths] = useState<number>(24);
    const [constants, setConstants] = useState({
        residualValuePercentage: DEFAULT_VALUES.residualValuePercentage,
        financingSpreadAnnual: DEFAULT_VALUES.financingSpreadAnnual,
        leaserFinancingRateAnnual: DEFAULT_VALUES.leaserFinancingRateAnnual,
        fileFeesPercentage: DEFAULT_VALUES.fileFeesPercentage,
    });
    const [results, setResults] = useState<SimulationResults | null>(null);

    // Fetch configuration constants
    useEffect(() => {
        const loadConstants = async () => {
            try {
                const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/calculation-rates/1`);
                const fetchedConstants = await response.json()
                setConstants(prevConstants => ({
                    ...prevConstants,
                    ...fetchedConstants,
                }));
            } catch (error) {
                console.error('Failed to load configuration constants:', error);
            }
        };

        loadConstants();
    }, []);

    // Recalculate results whenever inputs change
    useEffect(() => {
        if (totalAmount > 0) {
            const calculationResults = performCalculations(
                totalAmount,
                durationMonths,
                constants.residualValuePercentage,
                constants.financingSpreadAnnual,
                constants.leaserFinancingRateAnnual,
                constants.fileFeesPercentage
            );
            setResults(calculationResults);
        }
    }, [totalAmount, durationMonths, constants]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatPercentage = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    };

    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-[3fr_1fr] gap-6 px-28">
                {/* Simulation Form Card - Left Side */}
                <Card>
                    <CardHeader className="bg-ejaar-800 text-white">
                        <CardTitle>Simulation de Leasing</CardTitle>
                        <CardDescription className="text-ejaar-100">
                            Entrez les données pour calculer votre simulation de leasing
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {/* Row 1 */}
                            <div className="flex gap-6">
                                {/* Input for Total facture (HT) */}
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="totalAmount">Total facture (HT)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="totalAmount"
                                            type="number"
                                            min="0"
                                            value={totalAmount}
                                            onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                                            className="border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500"
                                        />
                                        <span className="text-sm text-gray-500">MAD</span>
                                    </div>
                                </div>
                                {/* Select for Durée en mois */}
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="durationMonths">Durée en mois</Label>
                                    <Select
                                        value={durationMonths.toString()}
                                        onValueChange={(value) => setDurationMonths(parseInt(value))}
                                    >
                                        <SelectTrigger
                                            className="border-ejaar-300 focus:border-ejaar-500 focus:ring-ejaar-500">
                                            <SelectValue placeholder="Sélectionnez une durée"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DURATION_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Row 2 */}
                            <div className="flex gap-6">
                                {/* Display for Valeur résiduelle % - Configurable constant */}
                                <div className="space-y-2 flex-1">
                                    <Label>Valeur résiduelle % - Considérée par Ejaar</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {formatPercentage(constants.residualValuePercentage)}
                                    </div>
                                </div>

                                {/* Display for Valeur résiduelle - Calculated field */}
                                <div className="space-y-2 flex-1">
                                    <Label>Valeur résiduelle</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {results ? formatCurrency(results.residualValue) : '0,00 MAD'}
                                    </div>
                                </div>
                            </div>


                            {/* Row 3 */}
                            <div className="flex gap-6">
                                {/* Display for Spread financement (Annuel) - Configurable constant */}
                                <div className="space-y-2 flex-1">
                                    <Label>Spread financement (Annuel)</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {formatPercentage(constants.financingSpreadAnnual)}
                                    </div>
                                </div>

                                {/* Display for Taux de financement - Leaser (Annuel) - Now a read-only display from config */}
                                <div className="space-y-2 flex-1">
                                    <Label>Taux de financement - Leaser (Annuel)</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {formatPercentage(constants.leaserFinancingRateAnnual)}
                                    </div>
                                </div>
                            </div>
                            {/* Row 4 */}
                            <div className="flex gap-6">
                                {/* Display for Taux de financement - Leaser (Mensuel) - Calculated field */}
                                <div className="space-y-2 flex-1">
                                    <Label>Taux de financement - Leaser (Mensuel)</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {results ? formatPercentage(results.leaserFinancingRateMonthly) : '0,00 %'}
                                    </div>
                                </div>

                                {/* Display for Frais de dossier Ejaar - Configurable constant */}
                                <div className="space-y-2 flex-1">
                                    <Label>Frais de dossier Ejaar</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {formatPercentage(constants.fileFeesPercentage)}
                                    </div>
                                </div>
                            </div>
                            {/* Row 5 */}
                            <div className="flex gap-6">
                                {/* Display for Taux de financement - Ejaar (Mensuel) - Calculated field */}
                                <div className="space-y-2 flex-1">
                                    <Label>Taux de financement - Ejaar (Annuel)</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {results ? formatPercentage(results.ejaarFinancingRateAnnual) : '0,00 %'}
                                    </div>
                                </div>

                                {/* Display for Frais de dossier Ejaar - Configurable constant */}
                                <div className="space-y-2 flex-1">
                                    <Label>Taux de financement - Ejaar (Mensuel)</Label>
                                    <div
                                        className="flex items-center h-10 px-3 border rounded-md border-input bg-muted/50 text-muted-foreground">
                                        {results ? formatPercentage(results.ejaarFinancingRateMonthly) : '0,00 %'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card - Right Side */}
                <div className="flex flex-col space-y-6">
                    {/* Additional Calculation Data Card */}
                    {/* Results Card */}
                    <Card>
                        <CardHeader className="bg-ejaar-800 text-white">
                            <CardTitle className="text-xl">Résultats de la simulation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {/* Display for Annuité finale client (Mensuel) - Calculated field */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-lg">Annuité finale client (Mensuel)</Label>
                                    <div
                                        className="flex items-center h-12 px-3 border-2 rounded-md border-ejaar-500 bg-ejaar-50 text-ejaar-800 font-bold text-xl">
                                        {results ? formatCurrency(results.monthlyPayment) : '0,00 MAD'}
                                    </div>
                                </div>

                                {/* Display for Total dû par le client - Calculated field */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-lg">Total dû par le client</Label>
                                    <div
                                        className="flex items-center h-12 px-3 border-2 rounded-md border-ejaar-500 bg-ejaar-50 text-ejaar-800 font-bold text-xl">
                                        {results ? formatCurrency(results.totalPayment) : '0,00 MAD'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EjaarSimulator;
