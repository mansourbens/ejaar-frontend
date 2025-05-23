import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from "next/link";
import Image from "next/image";

interface RentCalculatorProps {
    onBack: () => void;
    hideHeader?: boolean;
}

const RentCalculator = ({ onBack, hideHeader }: RentCalculatorProps) => {
    const [price, setPrice] = useState<number[]>([10000]);
    const [duration, setDuration] = useState<number[]>([24]);
    const [inputPrice, setInputPrice] = useState<string>('10000');
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

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
        const value = e.target.value.replace(/\D/g, '');
        setInputPrice(value);
        const numericValue = value ? parseInt(value, 10) : 0;
        if (!isNaN(numericValue)) {
            setPrice([Math.min(Math.max(numericValue, 1000)), 500000]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic would go here
    };

    return (
        <div className="h-full flex flex-col bg-transparent relative">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-transparent">
                <div className="space-y-4 md:space-y-6 flex-1">
                    {/* Price Section */}
                    <div className="space-y-4 py-2 hover:shadow-lg md:hover:shadow-2xl hover:bg-[#f5f2ed] transition-all duration-300 px-3 sm:px-4 rounded-xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <label className="text-lg sm:text-xl font-medium">Prix du matériel</label>
                            <div className="relative w-full sm:w-auto">
                                <Input
                                    type="text"
                                    value={inputPrice}
                                    onChange={handlePriceInputChange}
                                    className="w-full sm:w-32 text-center bg-gray-100 text-ejaar-700 pr-10 sm:pr-14 py-1 rounded-md text-base sm:text-lg font-medium"
                                />
                                <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-base sm:text-lg text-gray-500">
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
                        />
                        <div className="flex justify-between text-base sm:text-lg text-gray-500">
                            <span>1 000 DH</span>
                            <span>500 000 DH</span>
                        </div>
                    </div>

                    <div className="divider-ejaar border-t-2 border-dashed border-gray-400 w-[150px] sm:w-[200px] h-1 mx-auto my-6 sm:my-8"></div>

                    {/* Duration Section */}
                    <div className="hover:shadow-lg md:hover:shadow-2xl hover:bg-[#f5f2ed] transition-all duration-300 px-3 sm:px-4 rounded-xl">
                        <div className="flex flex-col sm:flex-row min-h-[100px] sm:min-h-[124px] justify-between items-start sm:items-center gap-4">
                            <label className="text-lg sm:text-xl font-medium">Durée</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setDuration([24])}
                                    className={`px-3 sm:px-4 py-2 rounded-md font-medium text-base sm:text-lg ${
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
                                    className={`px-3 sm:px-4 py-2 rounded-md font-medium text-base sm:text-lg ${
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

                    {/* Monthly Payment */}
                    <div className="bg-ejaar-700 text-white p-3 sm:p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span className="text-xl sm:text-2xl font-medium">Mensualité estimée</span>
                            <span className="text-lg sm:text-xl font-bold">
                                {formatPrice(monthlyPayment)}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-ejaar-100 mt-1">
                            Pour {formatPrice(price[0])} sur {formatDuration(duration[0])}
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="text-base sm:text-xl my-auto text-ejaar-700">
                        <p>Obtenez un devis détaillé et louez en quelques clics</p>
                    </div>
                    <div className="w-full sm:w-auto">
                        <Link href="/signup" className="w-full block">
                            <Button
                                className="w-full sm:w-auto text-base sm:text-xl p-3 sm:p-4 bg-ejaar-800 hover:bg-ejaar-700"
                            >
                                Découvrir
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>

            {/* Decorative Arrow */}
            <div className="md:block absolute bottom-[-70px] right-[50px] lg:right-[100px] z-20">
                <Image
                    src='/assets/images/arrow_bottom.png'
                    alt="Arrow decoration"
                    width={200}
                    height={20}
                    className="pulse-arrow"
                />
            </div>
        </div>
    );
};

export default RentCalculator;
