import { useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AdminUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

/**
 * Hook pour gérer l'authentification admin
 * Écoute les changements d'authentification Firebase
 */
export const useAdmin = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // S'abonner aux changements d'authentification
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            isAdmin: true, // Firebase gère l'authentification, on considère que si connecté = admin
          });
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      // Déconnexion est gérée par le composant
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la déconnexion');
    }
  }, []);

  return {
    currentUser,
    isLoading,
    error,
    isAdmin: currentUser?.isAdmin ?? false,
    isLoggedIn: currentUser !== null,
    logout,
  };
};
