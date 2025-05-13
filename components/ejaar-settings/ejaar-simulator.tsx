import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { DeviceType, performCalculations } from './calculations';
import { DURATION_OPTIONS } from "@/components/ejaar-settings/calculation-constants";
import { fetchWithToken, formatCurrency } from "@/lib/utils";
import { CategorieCA } from "@/components/ejaar-settings/rate-config";
import {Trash2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";

interface SimulationResults {
    residualValue: number;
    tauxBanque: number;
    spread: number;
    ejaarFinancingRateAnnual: number;
    ejaarFinancingRateMonthly: number;
    monthlyPayment: number;
    totalPayment: number;
}

interface DeviceEntry {
    id: number;
    deviceType: DeviceType;
    unitCount: number;
    unitPrice: number;
    durationMonths: number;
}

const EjaarSimulator = () => {
    const [deviceEntries, setDeviceEntries] = useState<DeviceEntry[]>([
        { id: 1, deviceType: DeviceType.WORKSTATION, unitCount: 1, unitPrice: 0, durationMonths: 24 }
    ]);

    const [clientCA, setClientCA] = useState<CategorieCA>(CategorieCA.MOINS_DE_5M);
    const [tauxLoyerConfig, setTauxLoyerConfig] = useState<TauxLoyerEntry[]>([]);
    const [residualConfig, setResidualConfig] = useState<ResidualConfigEntry[]>([]);
    const [results, setResults] = useState<SimulationResults | null>(null);

    const totalAmount = deviceEntries.reduce((sum, entry) => sum + (entry.unitCount * entry.unitPrice), 0);
    type ResidualConfigEntry = {
        device: string;
        months24: string;
        months36: string;
    };
    type TauxLoyerEntry = {
        categorieCA: string;
        tauxBanque: string;
        spread: string;
    };

    function buildResidualValueMap(data: ResidualConfigEntry[]) {
        return data.reduce((acc, curr) => {
            acc[curr.device] = {
                months24: parseFloat(curr.months24),
                months36: parseFloat(curr.months36),
            };
            return acc;
        }, {} as Record<string, { months24: number; months36: number }>);
    }

    function buildTauxLoyerMap(data: TauxLoyerEntry[]) {
        return data.reduce((acc, curr) => {
            acc[curr.categorieCA] = {
                tauxBanque: parseFloat(curr.tauxBanque),
                spread: parseFloat(curr.spread),
            };
            return acc;
        }, {} as Record<string, { tauxBanque: number; spread: number }>);
    }

    // Load config
    useEffect(() => {
        const loadConfigs = async () => {
            try {
                const [tauxResponse, residualResponse] = await Promise.all([
                    fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/rate-config`),
                    fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/residual-config`)
                ]);

                setTauxLoyerConfig(await tauxResponse.json());
                setResidualConfig(await residualResponse.json());
            } catch (error) {
                console.error('Failed to load configuration:', error);
            }
        };
        loadConfigs();
    }, []);
    type DurationKey = 'months24' | 'months36';

    function toDurationKey(months: number): DurationKey {
        if (months === 24) return 'months24';
        if (months === 36) return 'months36';
        throw new Error(`Unsupported duration: ${months}`);
    }
    useEffect(() => {
        if (deviceEntries.length && tauxLoyerConfig.length && residualConfig.length) {
            const tauxMap = buildTauxLoyerMap(tauxLoyerConfig);
            const residualMap = buildResidualValueMap(residualConfig);

            let totalMonthly = 0;
            let totalOverall = 0;

            for (const entry of deviceEntries) {
                if (entry.unitCount > 0 && entry.unitPrice > 0) {
                    const amount = entry.unitCount * entry.unitPrice;
                    const durationKey = toDurationKey(entry.durationMonths); // type-safe conversion
                    const residualValuePercentage = residualMap[entry.deviceType][durationKey];
                    const spread = tauxMap[clientCA].spread;
                    const leasingRate = tauxMap[clientCA].tauxBanque;

                    const res = performCalculations(
                        amount,
                        entry.durationMonths,
                        residualValuePercentage,
                        spread,
                        leasingRate
                    );

                    totalMonthly += res.monthlyPayment;
                    totalOverall += res.totalPayment;
                }
            }

            setResults({
                residualValue: 0,
                tauxBanque: 0,
                spread: 0,
                ejaarFinancingRateAnnual: 0,
                ejaarFinancingRateMonthly: 0,
                monthlyPayment: totalMonthly,
                totalPayment: totalOverall,
            });
        }
    }, [deviceEntries, clientCA, tauxLoyerConfig, residualConfig]);

    const updateEntry = (id: number, changes: Partial<DeviceEntry>) => {
        setDeviceEntries(prev =>
            prev.map(entry => entry.id === id ? { ...entry, ...changes } : entry)
        );
    };

    const addDeviceEntry = () => {
        setDeviceEntries(prev => [
            ...prev,
            {
                id: Date.now(),
                deviceType: DeviceType.WORKSTATION,
                unitCount: 1,
                unitPrice: 0,
                durationMonths: 24
            }
        ]);
    };

    const removeDeviceEntry = (id: number) => {
        setDeviceEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const formatPercentage = (value: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);

    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-[3fr_1fr] gap-6 px-28">
                {/* Input Form */}
                <Card>
                    <CardHeader className="bg-ejaar-800 text-white">
                        <CardTitle>Simulation de Leasing</CardTitle>
                        <CardDescription className="text-ejaar-100">
                            Entrez les données pour chaque type de matériel
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Client CA selection */}
                        <div className="space-y-2">
                            <Label>Catégorie CA client</Label>
                            <Select
                                value={clientCA}
                                onValueChange={(value) => setClientCA(value as CategorieCA)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.values(CategorieCA).map(ca => (
                                        <SelectItem key={ca} value={ca}>{ca}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="max-h-[30vh] overflow-auto">
                            {deviceEntries.map((entry, index) => (
                                <div key={entry.id} className="flex gap-4 items-end border-b pb-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Type de matériel</Label>
                                        <Select
                                            value={entry.deviceType}
                                            onValueChange={(value) => updateEntry(entry.id, { deviceType: value as DeviceType })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(DeviceType).map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-24 space-y-2">
                                        <Label>Unités</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={entry.unitCount}
                                            onChange={(e) => updateEntry(entry.id, { unitCount: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="w-32 space-y-2">
                                        <Label>Prix Unitaire</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={entry.unitPrice}
                                            onChange={(e) => updateEntry(entry.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="w-32 space-y-2">
                                        <Label>Durée (mois)</Label>
                                        <Select
                                            value={entry.durationMonths.toString()}
                                            onValueChange={(value) => updateEntry(entry.id, { durationMonths: parseInt(value) })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DURATION_OPTIONS.map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {deviceEntries.length > 1 && index != 0 &&
                                        <button type="button" onClick={() => removeDeviceEntry(entry.id)} className="text-red-600 mb-2">
                                            <Trash2Icon></Trash2Icon>
                                        </button>
                                    }

                                </div>
                            ))}

                        </div>

                        <button type="button" onClick={addDeviceEntry} className="text-blue-600">
                            + Ajouter un matériel
                        </button>

                        {/* Résumé */}
                        <div className="space-y-2">
                            <Label>Total montant du matériel financé</Label>
                            <div className="h-10 px-3 border rounded-md bg-muted/50 text-muted-foreground flex items-center">
                                {formatCurrency(totalAmount)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Résultats */}
                <div className="flex flex-col justify-between">
                    <Card>
                        <CardHeader className="bg-ejaar-800 text-white">
                            <CardTitle className="text-xl">Résultats</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="font-bold text-lg">Mensualité</Label>
                                <div className="h-12 px-3 border-2 rounded-md border-ejaar-500 bg-ejaar-50 text-ejaar-800 font-bold text-xl flex items-center">
                                    {results ? formatCurrency(results.monthlyPayment) : '0,00 MAD'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-lg">Total à payer</Label>
                                <div className="h-12 px-3 border-2 rounded-md border-ejaar-500 bg-ejaar-50 text-ejaar-800 font-bold text-xl flex items-center">
                                    {results ? formatCurrency(results.totalPayment) : '0,00 MAD'}
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
