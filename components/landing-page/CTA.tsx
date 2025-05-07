
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";

const CTA = () => {
    return (
        <section className="bg-ejaar-50 py-20 overflow-hidden">
            <div className="container mx-auto px-4 relative">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-ejaar-800 to-ejaar-900 z-10">
                    {/* Éléments décoratifs */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 lg:p-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Prêt à moderniser votre infrastructure ou augmentez vos ventes ?
                            </h2>
                            <div className="flex flex-col sm:flex-row justify-center mt-12 gap-4 mb-10">
                                <Link href="/signin">
                                <Button size="lg" className="bg-white text-ejaar-800 hover:bg-ejaar-50 text-2xl px-8 w-[300px] h-[60px]">
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
