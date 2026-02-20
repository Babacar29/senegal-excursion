import React, { useState } from 'react';
import { Menu, X, Phone, Palmtree } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm h-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link 
            to="/"
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-12 h-12 flex items-center justify-center bg-brand-sunset rounded-full overflow-hidden shadow-md group-hover:scale-110 transition-transform">
               <Palmtree className="text-brand-dark relative z-10" size={24} />
               <div className="absolute bottom-0 w-full h-1/3 bg-brand-dark/10"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-widest text-brand-dark uppercase">
                Senegal Excursion
              </span>
              <span className="text-[0.65rem] tracking-[0.2em] text-gray-500 uppercase font-sans">
                Explorez l'authenticité
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 uppercase tracking-wide font-sans relative
                    ${isActive(link.path) ? 'text-brand-accent font-bold' : 'text-gray-800 hover:text-brand-accent'}
                  `}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-brand-accent rounded-full"></span>
                  )}
                </Link>
              ))}
              <Link
                to="/contact"
                className="bg-brand-dark hover:bg-black text-brand-sunset px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg border border-brand-dark"
              >
                <Phone size={16} />
                Réserver
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark hover:text-brand-accent focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium uppercase tracking-wide
                  ${isActive(link.path) ? 'bg-brand-sand text-brand-accent' : 'text-gray-800 hover:text-brand-accent'}
                `}
              >
                {link.name}
              </Link>
            ))}
            <Link
               to="/contact"
               onClick={() => setIsOpen(false)}
               className="w-full text-center mt-6 bg-brand-sunset text-brand-dark px-3 py-4 rounded-md text-base font-bold flex justify-center items-center gap-2 uppercase tracking-wide"
            >
               <Phone size={18} /> Réserver maintenant
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;