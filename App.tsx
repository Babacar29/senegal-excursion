import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import AIChat from './components/AIChat';
import AdminUpload from './components/AdminUpload';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import { AdminProvider } from './components/AdminContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Wrapper to ensure ScrollToTop on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen font-sans bg-gray-50 text-gray-900 flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/destinations" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tarifs" element={<Navigate to="/" replace />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminUpload />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />

        <AIChat />
      </div>
    </>
  );
}

function App() {
  return (
    <AdminProvider>
      <Router>
        <AppContent />
      </Router>
    </AdminProvider>
  );
}
export default App;
