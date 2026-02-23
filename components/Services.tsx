import React from 'react';
import { Car, Plane, Map, Shield, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const Services: React.FC = () => {
  usePageSEO(
    "Services Chauffeur Privé & Excursions Sénégal",
    "Services de chauffeur privé 24/7 à Dakar et au Sénégal. Excursions touristiques à Gorée, Bandia, Sine-Saloum. Transferts aéroport AIBD, safaris et guide passionné pour découverte authentique."
  );

  const mainServices = [
    {
      title: "Chauffeur Privé",
      description: "Un service de transport pour vos déplacements à Dakar et dans tout le Sénégal. Profitez d'un véhicule climatisé, confortable et d'une conduite irréprochable.",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
      features: ["Voiture Climatisée", "Disponibilité 24/7", "Trajets longue distance", "Mise à disposition journée"]
    },
    {
      title: "Excursions Touristiques",
      description: "Découvrez les trésors cachés du Sénégal avec un expert local. De Mbour à l'île de Gorée, en passant par la réserve de Bandia, laissez-vous guider à travers l'histoire et la nature.",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
      features: ["Guide passionné", "Itinéraires sur mesure", "Immersion locale", "Satisfaction garantie"]
    },
    {
      title: "Transfert Aéroport AIBD",
      description: "Arrivez ou repartez l'esprit tranquille. Je vous accueille personnellement dès votre sortie de l'avion à l'Aéroport International Blaise Diagne (AIBD) pour un transfert direct et sécurisé.",
      image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop",
      features: ["Accueil avec pancarte", "Suivi du vol en temps réel", "Tarif fixe sans surprise", "Aide aux bagages"]
    }
  ];

  const qualityBadges = [
    { icon: <Shield size={28} />, title: "Sécurité Maximale", desc: "Véhicules entretenus et conduite prudente." },
    { icon: <CheckCircle2 size={28} />, title: "Fiabilité", desc: "Ponctualité garantie pour tous vos rendez-vous." },
    { icon: <Star size={28} />, title: "Service 5 Étoiles", desc: "L'hospitalité sénégalaise (Teranga) à votre service." },
  ];

  return (
    <main className="py-24 pt-32 bg-brand-sand relative overflow-hidden min-h-screen">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-sunset/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-dark/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-24">
          <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-sm">Mes Prestations</span>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
            Une Expérience de Voyage <br /> <span className="text-brand-sunset">Authentique & Confortable</span>
          </h1>
          <div className="w-24 h-1.5 bg-brand-sunset mx-auto mt-8 rounded-full"></div>
        </header>

        <div className="space-y-32">
          {mainServices.map((service, index) => (
            <article key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
              {/* Image Side */}
              <div className="w-full lg:w-1/2 group perspective">
                <div className="relative transform transition-transform duration-500 hover:scale-[1.02]">
                  <div className={`absolute -inset-4 bg-brand-sunset/20 rounded-2xl transform ${index % 2 === 1 ? '-rotate-3' : 'rotate-3'} transition-transform group-hover:rotate-0`}></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-dark text-brand-sunset rounded-lg shadow-md" aria-hidden="true">
                    {index === 0 && <Car size={24} />}
                    {index === 1 && <Map size={24} />}
                    {index === 2 && <Plane size={24} />}
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-brand-dark">{service.title}</h2>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  {service.description}
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-brand-dark font-medium">
                      <div className="w-1.5 h-1.5 bg-brand-sunset rounded-full" aria-hidden="true"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-brand-accent font-bold uppercase tracking-wider hover:text-brand-dark transition-all group"
                  >
                    <span className="border-b-2 border-brand-accent group-hover:border-brand-dark pb-0.5">Demander un devis</span>
                    <span className="transform group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Quality Badges */}
        <section className="mt-32 bg-white rounded-3xl shadow-xl border border-gray-100 p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-dark via-brand-sunset to-brand-dark"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {qualityBadges.map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 group">
                <div className="p-4 bg-brand-sand rounded-full text-brand-dark group-hover:bg-brand-dark group-hover:text-brand-sunset transition-colors duration-300" aria-hidden="true">
                  {badge.icon}
                </div>
                <h3 className="font-serif font-bold text-xl text-brand-dark">{badge.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{badge.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default Services;