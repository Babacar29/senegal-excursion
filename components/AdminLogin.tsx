import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, logout } from '../services/firebase';
import { usePageSEO } from '../hooks/usePageSEO';

const AdminLogin: React.FC = () => {
  usePageSEO(
    "Admin Login - Senegal Excursion",
    "Espace de connexion pour les administrateurs"
  );

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginAdmin(email, password);

      if (result.ok) {
        // Connexion réussie, attendre un peu que le contexte se mette à jour
        setTimeout(() => {
          navigate('/admin');
        }, 300);
      } else {
        setError(result.message || 'Erreur de connexion');
      }
    } catch (err: any) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-sand pt-32 pb-16 flex items-center justify-center">
      <div className="w-full max-w-lg px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-accent transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-red-50 p-4 rounded-full mb-4 shadow-inner">
                <Lock className="text-red-500" size={28} />
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">Admin Login</h1>
              <p className="text-gray-500 text-sm mt-2">Espace Administrateur - Senegal Excursion</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-red-800 font-semibold text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Administrateur
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@senegal-excursion.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Connexion en cours...' : 'Connexion'}
              </button>
            </form>

            {/* Footer Message */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Cette zone est réservée aux administrateurs autorisés. Les tentatives d'accès non autorisées sont enregistrées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
