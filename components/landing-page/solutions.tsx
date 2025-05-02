
import React from 'react';

const Solutions = () => {
    return (
        <section id="solutions" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Des <span className="gradient-text">Solutions Personnalisées</span> pour Chaque Secteur
                    </h2>
                    <p className="text-lg text-gray-700">
                        Nous comprenons que chaque secteur a des besoins spécifiques en matière de gestion de dossiers et de devis. Nos solutions de gestion de devis et de validation sont conçues pour répondre à vos exigences particulières.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="relative overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-ejaar-900 to-ejaar-700 opacity-95"></div>
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                        <div className="relative z-10 p-8 md:p-12 lg:p-16 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    Nous nous adaptons à l'évolution de vos besoins commerciaux
                                </h3>
                                <p className="text-white/80 mb-6">
                                    Nos solutions évolutives grandissent avec votre entreprise, vous garantissant un traitement rapide de vos devis et une gestion optimale des dossiers sans les contraintes de propriété.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="#contact" className="inline-flex justify-center items-center px-6 py-3 bg-white text-ejaar-800 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                                        Contactez nous
                                    </a>
                                    <a href="#learn-more" className="inline-flex justify-center items-center px-6 py-3 bg-transparent text-white border border-white/30 font-medium rounded-lg hover:bg-white/10 transition-colors">
                                        En savoir plus
                                    </a>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { value: '98.5%', label: 'Taux de traitement des devis en temps réel' },
                                        { value: '30%', label: 'Réduction des délais de validation bancaire' },
                                        { value: '100%', label: 'Support dédié à chaque étape du processus' },
                                        { value: '50+', label: 'Secteurs d\'activité couverts par nos solutions' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                                            <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                                            <div className="text-white/70 text-sm">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SolutionCard = ({
                          icon,
                          title,
                          description
                      }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) => {
    return (
        <div className="card-glow group hover:shadow-2xl transition-all duration-300">
            <div className="text-ejaar-800 mb-5">{icon}</div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <a
                href={`#${title.toLowerCase()}`}
                className="inline-flex items-center text-ejaar-700 font-medium group-hover:text-ejaar-800 transition-colors"
            >
                Learn more
                <svg
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
    );
};

export default Solutions;
