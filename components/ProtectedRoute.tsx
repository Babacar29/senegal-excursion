import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminContext } from './AdminContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Composant pour protéger les routes admin
 * Redirige vers login si pas authentifié
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/admin-login',
}) => {
  const { isLoggedIn, isLoading, error } = useAdminContext();
  const location = useLocation();

  // Pendant le chargement de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Si erreur d'authentification
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 font-semibold">Erreur d'authentification</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Si pas connecté, rediriger vers login
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si connecté, afficher le contenu
  return <>{children}</>;
};
