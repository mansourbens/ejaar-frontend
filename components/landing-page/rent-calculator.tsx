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
        return `${Math.floor(value).toLocaleString('fr-FR')} DH HT`;
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
        <div className="h-full flex flex-col bg-transparent relative">

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-transparent">
                <div className="space-y-2 flex-1">
                    <div className="space-y-4 py-2 hover:shadow-2xl hover:bg-[#f5f2ed] transition-all duration-300 px-4 rounded-xl">
                        <div className="flex justify-between items-center">
                            <label className="text-xl font-medium">Prix du matériel</label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={inputPrice}
                                    onChange={handlePriceInputChange}
                                    className="w-32 text-center bg-gray-100 text-ejaar-700 pr-14 py-1 rounded-md text-lg font-medium"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">
                                    DH
                                </span>
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
                                setInputPrice(value[0].toString());
                            }}
                            className=""
                        />
                        <div className="flex justify-between text-lg text-gray-500">
                            <span>1 000 DH</span>
                            <span>500 000 DH</span>
                        </div>
                    </div>
                    <div className="divider-ejaar border-t-2 border-dashed border-gray-400 w-[200px] h-1 mx-auto my-8"></div>
                    <div className=" hover:shadow-2xl hover:bg-[#f5f2ed] transition-all duration-300 px-4 rounded-xl">
                        <div className="flex min-h-[124px]  justify-between items-center">
                            <label className="text-xl font-medium">Durée</label>
                            <div className="flex items-center justify-center space-x-2 py-4">
                                <button
                                    type="button"
                                    onClick={() => setDuration([24])}
                                    className={`px-4 py-2 rounded-md font-medium text-lg ${
                                        duration[0] === 24
                                            ? 'bg-[#9d4833] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    24 mois
                                </button>
                                <button
                                    onClick={() => setDuration([36])}
                                    type="button"
                                    className={`px-4 py-2 rounded-md font-medium text-lg ${
                                        duration[0] === 36
                                            ? 'bg-[#9d4833] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    36 mois
                                </button>
                            </div>

                        </div>
                    </div>
                    {/* Monthly payment display */}
                    <div className="bg-ejaar-700 text-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-medium">Mensualité estimée</span>
                            <span className="text-xl font-bold">
                                {formatPrice(monthlyPayment)}
                            </span>
                        </div>
                        <p className="text-sm text-ejaar-100 mt-1">
                            Pour {formatPrice(price[0])} sur {formatDuration(duration[0])}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-between">
                    <div className="flex-3 text-xl my-auto text-ejaar-700 lato-regular">
                        <p>Obtenez un devis détaillé et louez en quelques clics</p>
                    </div>
                    <div className="flex-1 ml-auto flex">
                    <Link href="/signup" className=" ml-auto">
                        <Button
                            className="text-xl p-4 bg-ejaar-800 hover:bg-ejaar-700"
                        >
                            Découvrir
                        </Button>
                    </Link>
                    </div>
                </div>
            </form>
            <div>
                <img src='/assets/images/arrow_bottom.png' width={200} height={20} className="absolute pulse-arrow bottom-[-70px] right-[100px] z-20" />
            </div>
        </div>
    );
};

export default RentCalculator;
