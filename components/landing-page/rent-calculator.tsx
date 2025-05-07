import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {ArrowLeft, MoveRightIcon} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from "next/link"; // Make sure you have this component

interface RentCalculatorProps {
    onBack: () => void;
    hideHeader?: boolean;
}

const RentCalculator = ({ onBack, hideHeader }: RentCalculatorProps) => {
    const [price, setPrice] = useState<number[]>([10000]);
    const [duration, setDuration] = useState<number[]>([24]);
    const [inputPrice, setInputPrice] = useState<string>('10000');
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

    // Calculate monthly payment whenever price or duration changes
    useEffect(() => {
        const calculatedMonthly = price[0] / duration[0];
        setMonthlyPayment(calculatedMonthly);
    }, [price, duration]);

    const formatPrice = (value: number) => {
        return `${Math.floor(value).toLocaleString('fr-FR', {style:"currency", currency:"MAD"})} MAD HT`;
    };

    const formatDuration = (value: number) => {
        return `${value} mois`;
    };

    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        setInputPrice(value);

        const numericValue = value ? parseInt(value, 10) : 0;
        if (!isNaN(numericValue) && numericValue >= 1000 && numericValue <= 100000) {
            setPrice([numericValue]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic would go here
        alert(`Formulaire soumis: Prix: ${formatPrice(price[0])}, Durée: ${formatDuration(duration[0])}, Mensualité: ${formatPrice(monthlyPayment)}`);
    };

    return (
        <div className="h-full flex flex-col">
            {!hideHeader &&
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="p-2 mr-2 hover:bg-ejaar-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h3 className="text-xl font-bold text-ejaar-800">Estimez votre location</h3>
                </div>
            }

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-8 flex-1">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-base font-medium">Prix du matériel</label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={inputPrice}
                                    onChange={handlePriceInputChange}
                                    className="w-32 bg-ejaar-50 text-ejaar-800 pr-14 py-1 rounded-md text-sm font-medium"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                    MAD
                                </span>
                            </div>
                        </div>
                        <Slider
                            defaultValue={[10000]}
                            min={1000}
                            max={100000}
                            step={1000}
                            value={price}
                            onValueChange={(value) => {
                                setPrice(value);
                                setInputPrice(value[0].toString());
                            }}
                            className="py-4"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>1 000 dh</span>
                            <span>100 000 dh</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-base font-medium">Durée</label>
                            <span className="bg-ejaar-50 text-ejaar-800 px-2 py-1 rounded-md text-sm font-medium">
                                {formatDuration(duration[0])}
                            </span>
                        </div>
                        <Slider
                            defaultValue={[24]}
                            min={24}
                            max={36}
                            step={12}
                            value={duration}
                            onValueChange={setDuration}
                            className="py-4"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>24 mois</span>
                            <span>36 mois</span>
                        </div>
                    </div>

                    {/* Monthly payment display */}
                    <div className="bg-ejaar-900 text-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-medium">Mensualité estimée</span>
                            <span className="text-xl font-bold text-ejaar-50">
                                {formatPrice(monthlyPayment)}
                            </span>
                        </div>
                        <p className="text-sm text-ejaar-100 mt-1">
                            Pour {formatPrice(price[0])} sur {formatDuration(duration[0])}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-between">
                    <div className="flex-3 text-ejaar-900 lato-regular">
                        <p>Votre estimation vous convient ? Découvrez notre plateforme <MoveRightIcon className="inline-flex ml-8"></MoveRightIcon>
                            <br></br> et louez en quelques clics.</p>
                    </div>
                    <div className="flex-1 ml-auto flex">
                    <Link href="/signup" className=" ml-auto">
                        <Button
                            className="bg-ejaar-800 hover:bg-ejaar-700"
                        >
                            Découvrir
                        </Button>
                    </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RentCalculator;
