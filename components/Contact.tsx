import React, { useState, useRef } from 'react';
import { MessageCircle, Mail, Phone, ArrowRight, Send, User, MapPin, AlertCircle } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_EMAIL } from '../constants';
import { usePageSEO } from '../hooks/usePageSEO';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  usePageSEO(
    "Contact & Devis Excursion Sénégal - Découverte Locale",
    "Planifiez votre découverte du Sénégal. Contactez-nous pour organiser votre excursion sur mesure. Sénégal Excursion : transport, guide et découverte garantis."
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // ---------------------------------------------------------------------------
  // CONFIGURATION EMAILJS
  // Remplacez les valeurs ci-dessous par celles de votre tableau de bord EmailJS
  // https://dashboard.emailjs.com/admin
  // ---------------------------------------------------------------------------
  const SERVICE_ID = 'service_831s6jv';   // Ex: 'service_x8kq9s'
  const TEMPLATE_ID = 'template_2riymop'; // Ex: 'template_abc123'
  const PUBLIC_KEY = 'GQdKIsPXBrHyZEme5';   // Ex: 'user_A1b2C3d4E5'
  // ---------------------------------------------------------------------------

  // Format phone for WhatsApp URL
  const waNumber = CONTACT_PHONE.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${waNumber}?text=Bonjour, je souhaite avoir des informations sur vos excursions.`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });



    try {
      if (formRef.current) {
        await emailjs.sendForm(
          SERVICE_ID,
          TEMPLATE_ID,
          formRef.current,
          { publicKey: PUBLIC_KEY }
        );

        setStatus({ type: 'success', message: 'Message envoyé avec succès ! Je vous recontacterai très bientôt.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      setStatus({
        type: 'error',
        message: "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou utiliser WhatsApp."
      });
    } finally {
      setIsSubmitting(false);
      // Effacer le message de succès après 5 secondes
      if (status.type === 'success') {
        setTimeout(() => setStatus({ type: null, message: '' }), 5000);
      }
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-24 bg-brand-sand relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-sm text-brand-accent font-bold tracking-[0.2em] uppercase mb-3">Contact</h2>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-6">
          Planifions votre <span className="text-brand-sunset">Voyage</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          Une question sur une destination ? Besoin d'un chauffeur pour demain ?
          Remplissez le formulaire ou contactez-moi directement.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Column: Direct Contact Info */}
          <div className="space-y-8">
            {/* Quick Contact Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="font-serif text-2xl font-bold mb-6 text-brand-dark">Coordonnées</h3>

              <div className="space-y-6">
                <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-5 group p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-brand-sunset/20 rounded-full text-brand-dark group-hover:bg-brand-sunset transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Appelez-moi</p>
                    <p className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{CONTACT_PHONE}</p>
                  </div>
                </a>

                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-5 group p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-brand-sunset/20 rounded-full text-brand-dark group-hover:bg-brand-sunset transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email</p>
                    <p className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand-accent transition-colors break-all">{CONTACT_EMAIL}</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-brand-sunset/20 rounded-full text-brand-dark group-hover:bg-brand-sunset transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Localisation</p>
                    <p className="font-serif text-lg font-bold text-brand-dark">Dakar, Sénégal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-brand-dark rounded-2xl shadow-xl p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sunset/10 rounded-full blur-3xl group-hover:bg-brand-sunset/20 transition-all"></div>
              <MessageCircle size={48} className="mx-auto text-brand-sunset mb-4" />
              <h3 className="text-white font-serif text-2xl font-bold mb-2">WhatsApp Direct</h3>
              <p className="text-gray-400 mb-6 text-sm">Réponse rapide garantie pour vos urgences ou réservations.</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-brand-sunset text-brand-dark py-3 rounded-full font-bold hover:bg-brand-accent transition-colors"
              >
                Discuter maintenant <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border-t-4 border-brand-sunset">
            <h3 className="font-serif text-2xl font-bold mb-2 text-brand-dark">Envoyer un message</h3>
            <p className="text-gray-500 mb-8 text-sm">Remplissez le formulaire ci-dessous et je vous répondrai dans les plus brefs délais.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-brand-sunset focus:border-transparent outline-none transition-shadow bg-gray-50 focus:bg-white"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-brand-sunset focus:border-transparent outline-none transition-shadow bg-gray-50 focus:bg-white"
                      placeholder="+221 ..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-brand-sunset focus:border-transparent outline-none transition-shadow bg-gray-50 focus:bg-white"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-brand-sunset focus:border-transparent outline-none transition-shadow bg-gray-50 focus:bg-white"
                  placeholder="Je souhaiterais visiter Mbour..."
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-4 rounded-lg flex items-start gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {status.type === 'error' && <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                  <p className="text-sm font-medium">{status.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-dark text-white py-4 rounded-lg font-bold hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Envoi en cours...</span>
                ) : (
                  <>
                    Envoyer ma demande <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;