import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop"
          alt="Sénégal Landscape Sunset"
          className="w-full h-full object-cover"
        />
        {/* Gradient adjusted to match warm branding */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-brand-dark/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h2 className="text-brand-sunset uppercase tracking-[0.3em] text-sm md:text-lg font-bold mb-4 animate-fadeIn">
          Bienvenue au Sénégal
        </h2>
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-white mb-8 drop-shadow-xl leading-tight">
          SENEGAL <br /><span className="text-brand-sunset">EXCURSION</span>
        </h1>
        <p className="text-lg sm:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          <span className="italic font-serif">"Explorez l'authenticité"</span> <br />
          Votre chauffeur privé pour des balades inoubliables.
          De Mbour au Sine-Saloum, vivez l'aventure en tout confort.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="/contact"
            className="px-10 py-4 bg-brand-sunset hover:bg-brand-accent text-brand-dark font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-xl uppercase tracking-wider"
          >
            Réserver un trajet
          </Link>
          <Link
            to="/destinations"
            className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-brand-dark text-white font-semibold rounded-full text-lg transition-all uppercase tracking-wider"
          >
            Nos Destinations
          </Link>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-brand-sunset cursor-pointer opacity-80 hover:opacity-100">
        <a href="#about" onClick={scrollToAbout}>
          <ChevronDown size={40} />
        </a>
      </div>
    </section>
  );
};

export default Hero;