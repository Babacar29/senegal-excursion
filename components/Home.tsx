import React from 'react';
import Hero from './Hero';
import { ShieldCheck, Map, Clock, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const Home: React.FC = () => {
  usePageSEO(
    "Accueil - Chauffeur Privé & Guide",
    "Votre chauffeur privé et guide touristique au Sénégal. Découvrez Dakar, Gorée, Mbour et Saly en toute liberté. Transport confortable, circuits sur mesure et immersion locale garantie."
  );

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Introduction / About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute top-4 -left-4 w-full h-full border-2 border-brand-sunset rounded-2xl z-0 hidden md:block"></div>
              <img
                src="/chauffeur.png"
                alt="Chauffeur privé au Sénégal"
                className="rounded-2xl shadow-xl w-full object-cover z-10 relative aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-brand-sunset fill-current" size={20} />
                  <Star className="text-brand-sunset fill-current" size={20} />
                  <Star className="text-brand-sunset fill-current" size={20} />
                  <Star className="text-brand-sunset fill-current" size={20} />
                  <Star className="text-brand-sunset fill-current" size={20} />
                </div>
                <p className="font-bold text-brand-dark">Clients 100% Satisfaits</p>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-sm">À propos de moi</span>
              <h2 className="mt-4 font-serif text-4xl font-bold text-brand-dark leading-tight mb-6">
                Plus qu'un chauffeur, <br />
                <span className="text-brand-sunset">votre guide personnel.</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Bienvenue au Sénégal, le pays de la Teranga (l'hospitalité). Je suis chauffeur professionnel expérimenté, passionné par mon pays et ses richesses.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Mon objectif n'est pas seulement de vous conduire d'un point A à un point B, mais de faire de chaque trajet un moment de découverte et de confort. Que vous soyez ici pour le tourisme, les affaires ou une visite familiale, je m'adapte à votre rythme.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-brand-sand p-2 rounded-lg text-brand-dark">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Sécurité Prioritaire</h4>
                    <p className="text-sm text-gray-500">Conduite prudente et véhicules entretenus.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-brand-sand p-2 rounded-lg text-brand-dark">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Ponctualité</h4>
                    <p className="text-sm text-gray-500">Toujours à l'heure, à l'aéroport comme à l'hôtel.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link to="/contact" className="text-brand-dark font-bold border-b-2 border-brand-sunset hover:text-brand-accent transition-colors pb-1 inline-flex items-center gap-2">
                  Réserver mon chauffeur <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Banner */}
      <section className="bg-brand-dark py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
            <div className="px-4 py-4">
              <h3 className="font-serif text-2xl font-bold text-brand-sunset mb-2">Sur Mesure</h3>
              <p className="text-gray-300">Des itinéraires adaptés à vos envies. Vous décidez, je conduis.</p>
            </div>
            <div className="px-4 py-4">
              <h3 className="font-serif text-2xl font-bold text-brand-sunset mb-2">Confort</h3>
              <p className="text-gray-300">Véhicules climatisés, propres et spacieux pour les longs trajets.</p>
            </div>
            <div className="px-4 py-4">
              <h3 className="font-serif text-2xl font-bold text-brand-sunset mb-2">Disponibilité</h3>
              <p className="text-gray-300">Service 24/7. Transferts aéroport tardifs ou départs matinaux.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Destinations Preview */}
      <section className="py-20 bg-brand-sand relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sunset/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-sm">Découverte</span>
              <h2 className="mt-2 font-serif text-4xl font-bold text-brand-dark">Destinations Phares</h2>
            </div>
            <Link to="/destinations" className="px-6 py-3 bg-white border border-gray-200 rounded-full hover:bg-brand-dark hover:text-white transition-all shadow-sm font-medium text-sm">
              Voir toute la galerie
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link to="/destinations" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
              <img src="https://firebasestorage.googleapis.com/v0/b/senegal-excursion.firebasestorage.app/o/gallery%2F1771797683774_21374fc4-74a9-4401-a4ed-0330c8dcb754.JPG?alt=media&token=75b17a57-9d0d-4797-9614-9a989eed1daf?q=80&w=2070&auto=format&fit=crop" alt="Sine-Saloum" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white font-serif text-2xl font-bold">Sine-Saloum</h3>
                <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">Détente et beauté dans le delta.</p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/destinations" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
              <img src="https://firebasestorage.googleapis.com/v0/b/senegal-excursion.firebasestorage.app/o/gallery%2F1771774285757_139b8459-1680-4caa-ad7b-854c17ae008e.JPG?alt=media&token=63f24706-b7ca-4ccf-affb-169e73601cf1?q=80&w=2070&auto=format&fit=crop" alt="Gorée" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white font-serif text-2xl font-bold">Île de Gorée</h3>
                <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">Histoire et architecture coloniale.</p>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/destinations" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
              <img src="https://firebasestorage.googleapis.com/v0/b/senegal-excursion.firebasestorage.app/o/gallery%2F1771772197355_bc5cd660-05c8-4fa5-91da-b1e50439df58.JPG?alt=media&token=380cd780-7240-4648-940f-1358254e5ee8?q=80&w=2068&auto=format&fit=crop" alt="Bandia" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white font-serif text-2xl font-bold">Réserve de Bandia</h3>
                <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">Safari au cœur de la savane.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-24 bg-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-6">Prêt à partir ?</h2>
          <p className="text-xl text-gray-600 mb-10 font-light">
            Contactez-moi dès aujourd'hui pour organiser votre arrivée ou votre prochaine excursion.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-brand-sunset text-brand-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-accent transition-colors shadow-xl">
              Demander un devis gratuit
            </Link>
            <Link to="/services" className="px-8 py-4 border-2 border-gray-200 rounded-full font-bold text-gray-700 hover:border-brand-dark hover:text-brand-dark transition-colors">
              Voir mes services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;