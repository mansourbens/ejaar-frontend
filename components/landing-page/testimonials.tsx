"use client"
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = testimonials.length;

    const scrollToSlide = (index: number) => {
        if (sliderRef.current) {
            const newIndex = Math.max(0, Math.min(index, totalSlides - 1));
            sliderRef.current.scrollTo({
                left: newIndex * sliderRef.current.offsetWidth,
                behavior: 'smooth',
            });
            setActiveIndex(newIndex);
        }
    };

    const handleScrollNext = () => {
        scrollToSlide(activeIndex + 1);
    };

    const handleScrollPrev = () => {
        scrollToSlide(activeIndex - 1);
    };

    return (
        <section className="py-20 bg-ejaar-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ce que disent nos <span className="gradient-text">clients</span>
                    </h2>
                    <p className="text-lg text-gray-700">
                        Découvrez comment les solutions de location de matériel d'EJAAR ont transformé des entreprises dans divers secteurs.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth"
                    >
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="min-w-full snap-center px-4"
                            >
                                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <div className="aspect-square relative rounded-xl overflow-hidden bg-ejaar-100">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="mt-6 text-center md:text-left">
                                                <div className="flex justify-center md:justify-start mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:w-2/3">
                                            <div className="text-xl md:text-2xl font-medium italic text-gray-700 mb-6">
                                                &#34;{testimonial.quote}&#34;
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg">{testimonial.name}</div>
                                                <div className="text-gray-500">{testimonial.title}, {testimonial.company}</div>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <div className="flex flex-wrap gap-3">
                                                    {testimonial.tags.map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 bg-ejaar-50 text-ejaar-800 text-sm font-medium rounded-full"
                                                        >
                              {tag}
                            </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleScrollPrev}
                            disabled={activeIndex === 0}
                            className={`p-2 rounded-full ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>

                        <div className="flex space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        index === activeIndex ? 'bg-ejaar-800 w-6' : 'bg-ejaar-300'
                                    }`}
                                    onClick={() => scrollToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleScrollNext}
                            disabled={activeIndex === totalSlides - 1}
                            className={`p-2 rounded-full ${activeIndex === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const testimonials = [
    {
        name: "Sarah Johnson",
        title: "Directrice Technique",
        company: "TechNova Solutions",
        quote: "Le programme de leasing de matériel d'EJAAR nous a permis d'équiper toute notre équipe d'ingénieurs avec des stations de travail performantes tout en maintenant une flexibilité de trésorerie. Leur équipe de support est réactive et compétente.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        tags: ["Solutions pour Entreprises", "Développement Logiciel", "Stations de Travail"]
    },
    {
        name: "Michael Chen",
        title: "Directeur IT",
        company: "Global Finance Group",
        quote: "La sécurité et la fiabilité des solutions matérielles d'EJAAR ont été cruciales pour nos opérations financières. Leurs conditions de leasing personnalisées nous ont permis de mettre à jour notre infrastructure tout en optimisant notre budget.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        tags: ["Services Financiers", "Solutions de Sécurité", "Infrastructure"]
    },
    {
        name: "Elena Rodriguez",
        title: "Responsable des Opérations",
        company: "HealthFirst Medical Center",
        quote: "En tant que fournisseur de soins de santé, nous avons besoin d'équipements fiables qui respectent des normes strictes de conformité. EJAAR a fourni des solutions matérielles spécialisées répondant à nos besoins uniques tout en offrant un excellent support continu.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
        tags: ["Soins de Santé", "Conformité", "Services de Support"]
    }
];

export default Testimonials;
