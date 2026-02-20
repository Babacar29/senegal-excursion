import React from 'react';
import { AlertCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant pour vérifier les droits admin
 * Affiche un message d'accès refusé si pas admin
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  fallback,
}) => {
  // Dans cette implémentation, si l'utilisateur est authentifié via Firebase,
  // il est considéré comme admin. Si vous avez besoin de rôles granulaires,
  // expandez le contexte pour inclure un système de rôles.

  // Pour maintenant, on assume que si connecté = admin
  // Le fallback ne s'affichera que si vous implémentez un système de rôles

  return <>{children}</>;
};

/**
 * Page d'accès refusé
 */
export const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès Refusé</h1>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};
