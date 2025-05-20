import React from "react";
import LandingPage from "@/components/landing-page/landing-page";
import Features from "@/components/landing-page/features";
import CTA from "@/components/landing-page/CTA";
import LandingNavbar from "@/components/landing-page/landing-navbar";
import LandingFooter from "@/components/landing-page/landing-footer";
import RentEstimation from "@/components/landing-page/rent-estimation";
import {Solutions} from "@/components/landing-page/solutions";

export default function Home() {
  return (
      <div className="min-h-screen lato-regular bg-[#fcf5eb]">
        <LandingNavbar />
        <main>
          <LandingPage />
          <Features />
            <Solutions></Solutions>
            <RentEstimation />
          <CTA />
        </main>
        <LandingFooter />
      </div>
/*
      <div className="flex flex-col min-h-screen">
        {/!* Navigation *!/}
        <header className="border-b bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img alt='logo' src='/assets/logos/ejaar_logo_v2.svg' width={164} height={40}  />
              </div>
              <nav className="hidden md:flex items-center space-x-4">
                <Link href="/" className="px-3 py-2 text-sm font-medium text-primary rounded-md">
                  Accueil
                </Link>
                <Link href="#services" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-md">
                  Services
                </Link>
                <Link href="#about" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-md">
                  À propos
                </Link>
                <Link href="#contact" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-md">
                  Contact
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link href="/signin">
                  <Button variant="outline">Se connecter</Button>
                </Link>
                <Link href="/signup">
                  <Button>Créer un compte</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/!* Hero section *!/}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Solutions flexibles <br /> de location de matériel informatique
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  Obtenez le dernier équipement informatique pour votre entreprise sans coûts initiaux.
                  Nos options de location sont adaptées à vos besoins.
                </p>
                <div className="flex space-x-4">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                      Commencer
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="border-white text-blue-800 hover:bg-blue-200">
                      En savoir plus
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-3 scale-105 opacity-50"></div>
                  <div className="relative bg-blue-500 rounded-lg p-8 shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Devis rapide</h3>
                    <p className="mb-6">
                      Inscrivez-vous pour demander un devis et commencez votre solution de location informatique dès aujourd’hui.
                    </p>
                    <Link href="/signup">
                      <Button className="w-full">Créer un compte</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/!* Features section *!/}
        <section className="py-20 bg-gray-50" id="services">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Pourquoi choisir EJAAR</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nous fournissons des solutions complètes de location de matériel informatique pour aider les entreprises à rester agiles et compétitives.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <Server className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Matériel de pointe</h3>
                <p className="text-gray-600">
                  Accédez aux dernières technologies sans coûts de dépréciation. Restez compétitif avec des équipements à la pointe.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Conditions flexibles</h3>
                <p className="text-gray-600">
                  Choisissez parmi différentes durées de location et taux de retour adaptés à vos besoins professionnels.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <PieChart className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Coûts prévisibles</h3>
                <p className="text-gray-600">
                  Transformez les dépenses en capital en charges d’exploitation avec des paiements mensuels fixes pour une meilleure gestion budgétaire.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/!* How it works *!/}
        <section className="py-20" id="how-it-works">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Notre processus est conçu pour être simple et rapide, afin de vous fournir le matériel dont vous avez besoin sans délai.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Inscription</h3>
                <p className="text-gray-600">
                  Créez votre compte pour accéder à notre plateforme de location.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Demandez un devis</h3>
                <p className="text-gray-600">
                  Remplissez vos besoins en matériel et vos préférences de location.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Recevez une offre</h3>
                <p className="text-gray-600">
                  Nous générerons un devis personnalisé en fonction de vos besoins.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-xl font-bold mb-4">4</div>
                <h3 className="text-xl font-bold mb-2">Recevez le matériel</h3>
                <p className="text-gray-600">
                  Finalisez le processus et recevez votre équipement en location.
                </p>
              </div>
            </div>
          </div>
        </section>
      {/!* Footer *!/}
        <footer className="bg-gray-900 text-white py-12 mt-auto">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Image alt='logo' src='/assets/logos/ejaar_logo_v2.png' width={36} height={36} />
                  <span className="ml-2 text-xl font-bold">EJAAR</span>
                </div>
                <p className="text-gray-400">
                  Solutions professionnelles de location de matériel informatique pour les entreprises de toutes tailles.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white">Accueil</Link></li>
                  <li><Link href="#services" className="text-gray-400 hover:text-white">Services</Link></li>
                  <li><Link href="#about" className="text-gray-400 hover:text-white">À propos</Link></li>
                  <li><Link href="#contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white">Location de matériel</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Location de serveurs</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Location de stations de travail</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Équipements réseau</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Nous contacter</h3>
                <address className="text-gray-400 not-italic">
                  <p>123 rue de la Tech</p>
                  <p>Quartier des affaires</p>
                  <p>Email : info@ejaar.com</p>
                  <p>Téléphone : +1 (555) 123-4567</p>
                </address>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© 2025 EJAAR. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
*/
  );
}
