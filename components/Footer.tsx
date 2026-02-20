import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">SENEGAL EXCURSION</h3>
            <p className="text-sm leading-relaxed">
              Votre partenaire de confiance pour découvrir le Sénégal authentique.
              Transport sécurisé, guides passionnés et souvenirs garantis.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-sunset transition">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-brand-sunset transition">Services</Link></li>
              <li><Link to="/destinations" className="hover:text-brand-sunset transition">Galerie Photos</Link></li>
              <li><Link to="/contact" className="hover:text-brand-sunset transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">Légal</h3>
            <p className="text-sm">© {new Date().getFullYear()} Senegal Excursion.</p>
            <p className="text-sm mt-2">Tous droits réservés.</p>

            <Link
              to="/admin-login"
              className="mt-6 flex items-center gap-1 text-xs text-gray-600 hover:text-brand-sunset transition"
            >
              <Lock size={12} />
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;