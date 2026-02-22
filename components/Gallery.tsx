import React, { useEffect, useState } from 'react';
import { GalleryItem, Category } from '../types';
import { fetchGalleryItems, getMediaUrl, getImageFilename, isVideo } from '../services/firebase';
import { Filter, Loader2, MapPin, PlayCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageSEO';

const Gallery: React.FC = () => {
  usePageSEO(
    "Excursions au Sénégal en Images - Galerie Photos & Vidéos",
    "Découvrez les plus beaux paysages du Sénégal : Gorée, Sine-Saloum, Bandia et Fathala. Visionnez notre galerie photos et vidéos pour préparer votre prochain voyage."
  );

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('Tous');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchGalleryItems();
      setItems(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Close lightbox on Escape, navigate with arrows
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(prev => prev !== null ? Math.min(prev + 1, filteredItems.length - 1) : null);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => prev !== null ? Math.max(prev - 1, 0) : null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxIndex]);

  const categories: Category[] = [
    'Tous',
    'Dakar / Gorée',
    'Sine-Saloum',
    'Fathala',
    'Réserve de Bandia',
    'Mbour',
    'Village'
  ];

  const filteredItems = activeCategory === 'Tous'
    ? items
    : items.filter(item => item.location === activeCategory || item.location.includes(activeCategory) || item.title.includes(activeCategory));

  const lightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section className="py-24 pt-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm text-brand-accent font-bold tracking-[0.2em] uppercase mb-3">Galerie</h2>
          <h3 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-6">
            Destinations Populaires
          </h3>
          <div className="w-24 h-1 bg-brand-sunset mx-auto mb-8"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les paysages époustouflants que nous pouvons explorer ensemble.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border
                ${activeCategory === cat
                  ? 'bg-brand-dark text-brand-sunset border-brand-dark shadow-lg transform scale-105'
                  : 'bg-transparent text-gray-500 border-gray-200 hover:border-brand-sunset hover:text-brand-dark'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-brand-sunset" size={48} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-brand-sand rounded-xl border border-dashed border-gray-300">
            <Filter size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-serif">Aucune photo trouvée pour cette destination.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => {
              const url = getMediaUrl(item);
              const isVid = isVideo(getImageFilename(item.image));

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg bg-gray-100 cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="aspect-w-4 aspect-h-3 h-72 overflow-hidden relative">
                    {isVid ? (
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                      />
                    ) : (
                      <img
                        src={url}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out grayscale-[20%] group-hover:grayscale-0"
                      />
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 opacity-90 group-hover:opacity-100">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-flex items-center gap-1 text-brand-sunset text-xs font-bold uppercase tracking-widest mb-2">
                        <MapPin size={12} /> {item.location}
                      </span>
                      <h3 className="text-white text-2xl font-serif font-bold mb-2 drop-shadow-md">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 text-sm leading-relaxed drop-shadow-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isVid && (
                    <div className="absolute top-3 right-3 bg-brand-dark/50 backdrop-blur-md text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs pointer-events-none z-10">
                      <PlayCircle size={14} /> Vidéo
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Lightbox Popup ─── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-20 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm"
          >
            <X size={24} />
          </button>

          {/* Previous */}
          {lightboxIndex! > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex! - 1); }}
              className="absolute left-4 md:left-8 z-20 text-white/60 hover:text-white transition-all bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm hover:scale-110"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next */}
          {lightboxIndex! < filteredItems.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex! + 1); }}
              className="absolute right-4 md:right-8 z-20 text-white/60 hover:text-white transition-all bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm hover:scale-110"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Media + Info */}
          <div
            className="relative max-w-5xl w-full mx-4 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'scaleIn 0.25s ease-out' }}
          >
            {/* Media */}
            <div className="w-full overflow-hidden rounded-xl shadow-2xl" style={{ height: '70vh' }}>
              {isVideo(getImageFilename(lightboxItem.image)) ? (
                <video
                  src={getMediaUrl(lightboxItem)}
                  controls
                  autoPlay
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <img
                  src={getMediaUrl(lightboxItem)}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>

            {/* Caption */}
            <div className="mt-5 text-center max-w-2xl">
              <h3 className="text-white text-xl md:text-2xl font-serif font-bold mb-1">{lightboxItem.title}</h3>
              <span className="inline-flex items-center gap-1.5 text-brand-sunset text-xs font-bold uppercase tracking-widest">
                <MapPin size={12} /> {lightboxItem.location}
              </span>
              {lightboxItem.description && (
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{lightboxItem.description}</p>
              )}
              <p className="text-gray-600 text-xs mt-3">
                {lightboxIndex! + 1} / {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default Gallery;