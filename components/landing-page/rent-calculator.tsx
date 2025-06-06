// (imports unchanged)
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from "next/link";
import Image from "next/image";
import {performCalculations} from "@/components/ejaar-settings/calculations";
import {fetchWithToken} from "@/lib/utils";
import {CategorieCA, TauxLoyerMapping} from "@/components/ejaar-settings/rate-config";

interface RentCalculatorProps {
    onBack: () => void;
    hideHeader?: boolean;
}

const RentCalculator = ({ onBack, hideHeader }: RentCalculatorProps) => {
    const [price, setPrice] = useState<number[]>([10000]);
    const [duration, setDuration] = useState<number[]>([24]);
    const [inputDisplay, setInputDisplay] = useState<string>('10 000'); // Formatted display
    const [inputValue, setInputValue] = useState<string>('10000'); // Raw value
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [tauxLoyer, setTauxLoyer] = useState<TauxLoyerMapping | null>(null);

    useEffect(() => {
        getTauxLoyer();
    }, []);
    useEffect(() => {
        const calculatedMonthly = price[0] / duration[0];
        setMonthlyPayment(calculatedMonthly);
    }, [price, duration]);

    const formatPriceDisplay = (value: string) => {
        // Remove all non-digit characters first
        const number = parseInt(value.replace(/\s/g, ""), 10);
        if (isNaN(number)) return "";
        return new Intl.NumberFormat("fr-FR").format(number);
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

    const getTauxLoyer = async (): Promise<void> => {
        const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/rate-config`);
        const backendData = await response.json();
        setTauxLoyer(backendToFrontendMapping(backendData));
    };


    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Save the display value with formatting
        setInputDisplay(formatPriceDisplay(value));
        // Save the raw numeric value without formatting
        const numericValue = value.replace(/\D/g, '');
        setInputValue(numericValue);

        const parsedValue = numericValue ? parseInt(numericValue, 10) : 0;
        if (!isNaN(parsedValue)) {
            setPrice([Math.min(Math.max(parsedValue, 1000), 500000)]);
        }
    };

    // Update the input value when slider changes
    useEffect(() => {
        if (price[0].toString() !== inputValue) {
            setInputDisplay(price[0].toLocaleString('fr-FR').replace(/,/g, ' '));
            setInputValue(price[0].toString());
        }
    }, [price]);

    const formatPrice = (value: number) => {
        return `${Math.floor(value).toLocaleString('fr-FR')} DH HT`;
    };

    const formatDuration = (value: number) => {
        return `${value} mois`;
    };

    const getMinEstimation = () => {
        if (tauxLoyer) {
            const res = performCalculations(
                price[0],
                duration[0],
                10,
                tauxLoyer[CategorieCA.MOINS_DE_5M].spread / 100,
                tauxLoyer[CategorieCA.MOINS_DE_5M].tauxBanque / 100,
            );
            console.log(tauxLoyer[CategorieCA.MOINS_DE_5M].spread,
                tauxLoyer[CategorieCA.MOINS_DE_5M].tauxBanque);
            return res.monthlyPayment;
        }

    }
    const getMaxEstimation = () => {
        if (tauxLoyer) {
            const res = performCalculations(
                price[0],
                duration[0],
                5,
                tauxLoyer[CategorieCA.PLUS_DE_50M].spread / 100,
                tauxLoyer[CategorieCA.PLUS_DE_50M].tauxBanque / 100,
            );
            return res.monthlyPayment;
        }
    }

    return (
        <div className="h-full flex flex-col bg-transparent relative px-4 py-4 sm:px-6 sm:py-6 max-w-3xl mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6 w-full">
                {/* Price Section */}
                <div className="space-y-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <label className="text-lg sm:text-xl font-medium">Prix du matériel</label>
                        <div className="relative w-full sm:w-48">
                            <Input
                                type="text"
                                value={inputDisplay}
                                onChange={handlePriceInputChange}
                                className="w-full text-center bg-gray-100 text-ejaar-700 pr-10 py-2 rounded-md text-base sm:text-lg font-medium"
                            />
                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base text-gray-500">DH</span>
                        </div>
                    </div>
                    <Slider
                        defaultValue={[10000]}
                        min={1000}
                        max={500000}
                        step={1000}
                        value={price}
                        onValueChange={(value) => {
                            setPrice(value);
                            // Update both the raw value and formatted display
                            setInputValue(value[0].toString());
                            setInputDisplay(value[0].toLocaleString('fr-FR').replace(/,/g, ' '));
                        }}
                    />

                    <div className="flex justify-between text-sm sm:text-base text-gray-500">
                        <span>1 000 DH</span>
                        <span>500 000 DH</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-400 w-32 sm:w-48 mx-auto my-4" />

                {/* Duration Section */}
                <div className="p-4 bg-white rounded-xl hover:shadow-lg transition-all">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center min-h-[100px]">
                        <label className="text-lg sm:text-xl font-medium">Durée</label>
                        <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
                            {[24, 36].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setDuration([option])}
                                    className={`px-4 py-2 rounded-md font-medium text-base sm:text-lg transition ${
                                        duration[0] === option
                                            ? 'bg-[#9d4833] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {option} mois
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Payment */}
                <div className="bg-ejaar-700 text-white p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-xl sm:text-2xl font-medium">Mensualité estimée</span>
                        <span className="text-lg sm:text-xl font-bold">{formatPrice(getMinEstimation() ?? 0)} à  {formatPrice(getMaxEstimation() ?? 0) }</span>
                    </div>
                    <p className="text-xs sm:text-sm text-ejaar-100 mt-1">
                        Pour {formatPrice(price[0])} sur {formatDuration(duration[0])}
                    </p>
                </div>

                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                    <p className="text-base sm:text-lg text-ejaar-700 text-center sm:text-left">
                        Obtenez un devis détaillé et louez en quelques clics
                    </p>
                    <Link href="/signup" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto text-base sm:text-xl px-6 py-3 bg-ejaar-800 hover:bg-ejaar-700">
                            Découvrir
                        </Button>
                    </Link>
                </div>
            </form>

            {/* Decorative Arrow */}
            <div className="absolute bottom-[-36px] right-24 sm:right-32 z-20">
                <Image
                    src="/assets/images/arrow_bottom.png"
                    alt="Arrow decoration"
                    width={150}
                    height={20}
                    className="pulse-arrow"
                />
            </div>
        </div>
    );
};

export default RentCalculator;
