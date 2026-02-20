import React, { createContext, useContext, ReactNode } from 'react';
import { useAdmin } from '../hooks/useAdmin';

interface AdminContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  currentUser: {
    uid: string;
    email: string | null;
  } | null;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * Provider pour gérer l'état admin globalement
 */
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, isLoading, error, isAdmin, isLoggedIn } = useAdmin();

  const value: AdminContextType = {
    isLoggedIn,
    isLoading,
    isAdmin,
    currentUser: currentUser
      ? {
          uid: currentUser.uid,
          email: currentUser.email,
        }
      : null,
    error,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

/**
 * Hook pour utiliser le contexte admin
 */
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};
