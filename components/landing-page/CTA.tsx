
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";

const CTA = () => {
    return (
        <section className="bg-[#fcf5eb] py-20 overflow-hidden ">
            <div className="container mx-auto px-4 relative">
                <div className="relative rounded-3xl overflow-hidden cta-container z-10">
                    {/* Éléments décoratifs */}

                    <div className="relative z-10 p-8 md:p-12 lg:p-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#182e43ff] mb-6">
                                Prêt à moderniser votre infrastructure ou augmentez vos ventes ?
                            </h2>
                            <div className="flex flex-col sm:flex-row justify-center mt-12 gap-4 mb-10">
                                <Link href="/signin">
                                <Button size="lg" className="bg-[#9d4833] text-gray-50 hover:bg-[#b35e49] text-2xl px-8 w-[300px] h-[60px]">
                                    Découvrir
                                </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
