import React, { useEffect, useState, useMemo } from 'react';
import { Upload, Check, Lock, Image as ImageIcon, Video, AlertCircle, LogOut, ArrowLeft, Trash2, Pencil, X, Loader2, MapPin, Save, Filter } from 'lucide-react';
import { uploadGalleryItem, loginAdmin, isAuthenticated, logout, fetchGalleryItems, getMediaUrl, getImageFilename, isVideo, deleteGalleryItem, updateGalleryItem, logAdminAction } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { useAdminContext } from './AdminContext';
import { GalleryItem, Category } from '../types';

const AdminUpload: React.FC = () => {
  usePageSEO(
    "Espace Admin",
    "Panneau d'administration pour gérer la galerie Senegal Excursion."
  );

  const navigate = useNavigate();
  const adminContext = useAdminContext();
  
  // État local pour le formulaire
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(adminContext.isLoggedIn);

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Gallery management state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [adminCategory, setAdminCategory] = useState<Category>('Tous');

  // Sync avec le contexte admin
  useEffect(() => {
    setIsLoggedIn(adminContext.isLoggedIn);
  }, [adminContext.isLoggedIn]);

  const locationOptions = [
    'Dakar / Gorée', 'Lac Rose', 'Sine-Saloum',
    'Désert de Lompoul', 'Fathala', 'Réserve de Bandia', 'Autre'
  ];

  const categories: Category[] = [
    'Tous', 'Dakar / Gorée', 'Lac Rose', 'Sine-Saloum',
    'Désert de Lompoul', 'Fathala', 'Réserve de Bandia'
  ];

  const filteredGalleryItems = useMemo(() => {
    if (adminCategory === 'Tous') return galleryItems;
    return galleryItems.filter(item => item.location === adminCategory || item.location.includes(adminCategory));
  }, [galleryItems, adminCategory]);

  const loadGallery = async () => {
    setLoadingGallery(true);
    const items = await fetchGalleryItems();
    setGalleryItems(items);
    setLoadingGallery(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadGallery();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const result = await loginAdmin(email, password);

    if (result.ok) {
      setIsLoggedIn(true);
    } else {
      setLoginError(result.message || "Erreur de connexion.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Erreur lors de la déconnexion');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !location) return;

    setIsUploading(true);
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('image', file);
    if (description) formData.append('description', description);

    try {
      await uploadGalleryItem(formData);
      
      // Log l'action admin
      await logAdminAction('gallery_upload', {
        title,
        location,
        fileName: file.name,
        fileSize: file.size,
        description,
      });
      
      setUploadSuccess(true);
      setTitle('');
      setLocation('');
      setDescription('');
      setFile(null);
      // Reload gallery
      loadGallery();
    } catch (error) {
      // Handled in service
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteGalleryItem(id);
    if (success) {
      // Log l'action admin
      const deletedItem = galleryItems.find(item => item.id === id);
      await logAdminAction('gallery_delete', {
        itemId: id,
        title: deletedItem?.title,
        location: deletedItem?.location,
      });
      
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditLocation(item.location);
    setEditDescription(item.description || '');
    setEditFile(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('location', editLocation);
    formData.append('description', editDescription);
    if (editFile) {
      formData.append('image', editFile);
    }

    const updated = await updateGalleryItem(editingItem.id, formData);
    if (updated) {
      // Log l'action admin
      await logAdminAction('gallery_update', {
        itemId: editingItem.id,
        title: editTitle,
        location: editLocation,
        fileChanged: !!editFile,
      });
      
      setGalleryItems(prev => prev.map(item => item.id === updated.id ? updated : item));
      setEditingItem(null);
    }
    setIsSaving(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-sand pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-accent transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">
                Espace Admin
              </h1>
              <p className="text-gray-500 mt-1">
                {isLoggedIn 
                  ? `Connecté en tant que ${adminContext.currentUser?.email}` 
                  : "Connexion requise"}
              </p>
            </div>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 text-sm font-semibold group"
              >
                <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Déconnexion
              </button>
            )}
          </div>
          <div className="w-20 h-1 bg-brand-sunset rounded-full mt-4"></div>
        </div>

        {!isLoggedIn ? (
          /* ─── Login Form ─── */
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex flex-col items-center mb-8">
                <div className="bg-red-50 p-4 rounded-full mb-4 shadow-inner">
                  <Lock className="text-red-500" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 font-serif">Connexion Admin</h2>
                <p className="text-gray-500 text-sm mt-1">Authentifiez-vous pour gérer la galerie</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Admin</label>
                  <input
                    type="email"
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-brand-sunset focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                  <input
                    type="password"
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-brand-sunset focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {loginError && (
                  <div className="flex items-start gap-2.5 bg-red-50 p-4 rounded-xl border border-red-100">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-red-600 text-sm">{loginError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand-dark text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98] shadow-lg mt-2"
                >
                  Se connecter
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ─── Authenticated Admin Content ─── */
          <div className="space-y-10">

            {/* ─── Upload Card ─── */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-brand-sunset/20 p-4 rounded-full mb-4 flex gap-2">
                    <ImageIcon className="text-brand-dark" size={24} />
                    <Video className="text-brand-dark" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-dark font-serif">Ajouter un Média</h2>
                  <p className="text-sm text-gray-500 mt-1">Photo ou vidéo pour la galerie</p>
                </div>

                {uploadSuccess && (
                  <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <p className="text-green-700 text-sm font-medium">Média ajouté avec succès !</p>
                  </div>
                )}

                <form onSubmit={handleUpload} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-brand-sunset focus:ring-2 focus:ring-brand-sunset/30 transition"
                      placeholder="Ex: Balade en pirogue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Lieu (Catégorie)</label>
                    <select
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none focus:border-brand-sunset focus:ring-2 focus:ring-brand-sunset/30 transition"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {locationOptions.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-brand-sunset focus:ring-2 focus:ring-brand-sunset/30 transition"
                      rows={3}
                      placeholder="Description optionnelle..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fichier (Image ou Vidéo)</label>
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-brand-sunset transition-colors relative overflow-hidden group">
                      {file ? (
                        <div className="z-10 text-center p-2">
                          <Check className="mx-auto text-green-500 mb-1" size={24} />
                          <p className="text-sm font-bold text-gray-700 truncate max-w-[250px]">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                          <Upload className="text-gray-400 mb-2 group-hover:text-brand-sunset transition-colors" size={28} />
                          <p className="text-sm text-gray-500 font-medium">Cliquez pour uploader</p>
                          <p className="text-xs text-gray-400 mt-1">MP4, JPG, PNG...</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={e => { setFile(e.target.files?.[0] || null); setUploadSuccess(false); }}
                        required
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-brand-sunset text-brand-dark py-3.5 rounded-xl font-bold hover:bg-brand-accent transition-all flex justify-center items-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Envoi en cours..." : <> <Check size={18} /> Publier le média </>}
                  </button>
                </form>
              </div>
            </div>

            {/* ─── Existing Gallery Section ─── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-dark">Médias existants</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredGalleryItems.length} élément{filteredGalleryItems.length !== 1 ? 's' : ''}
                    {adminCategory !== 'Tous' ? ` — ${adminCategory}` : ' dans la galerie'}
                  </p>
                </div>
                <button
                  onClick={loadGallery}
                  disabled={loadingGallery}
                  className="text-sm text-brand-accent hover:text-brand-dark font-semibold transition-colors disabled:opacity-50"
                >
                  {loadingGallery ? "Chargement..." : "↻ Actualiser"}
                </button>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setAdminCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border
                      ${adminCategory === cat
                        ? 'bg-brand-dark text-brand-sunset border-brand-dark shadow-md scale-105'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-brand-sunset hover:text-brand-dark'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {loadingGallery ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-brand-sunset" size={36} />
                </div>
              ) : galleryItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                  <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-400 font-serif text-lg">Aucun média dans la galerie</p>
                  <p className="text-gray-400 text-sm mt-1">Uploadez votre premier média ci-dessus</p>
                </div>
              ) : filteredGalleryItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                  <Filter size={36} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 font-serif text-base">Aucun média pour « {adminCategory} »</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGalleryItems.map((item) => {
                    const url = getMediaUrl(item);
                    const filename = getImageFilename(item.image);
                    const isVid = isVideo(filename);
                    const isDeleting = deletingId === item.id;
                    const isConfirming = confirmDeleteId === item.id;

                    return (
                      <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                        {/* Media Preview */}
                        <div className="h-44 bg-gray-100 relative overflow-hidden">
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
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                          {isVid && (
                            <div className="absolute top-2 right-2 bg-brand-dark/60 backdrop-blur text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                              <Video size={10} /> Vidéo
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <h3 className="font-serif font-bold text-brand-dark text-sm truncate" title={item.title}>
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin size={10} />
                            <span className="truncate">{item.location}</span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                          )}
                          <p className="text-[10px] text-gray-300 mt-2">
                            {new Date(item.created).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors"
                          >
                            <Pencil size={13} />
                            Modifier
                          </button>

                          {isConfirming ? (
                            <div className="flex-1 flex gap-1">
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={isDeleting}
                                className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 py-2 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isDeleting ? <Loader2 size={13} className="animate-spin" /> : "Oui"}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 flex items-center justify-center text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Edit Modal ─── */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setEditingItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-xl font-serif font-bold text-brand-dark">Modifier le média</h2>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {/* Current media thumbnail */}
              <div className="h-32 bg-gray-100 rounded-xl overflow-hidden">
                {isVideo(getImageFilename(editingItem.image)) ? (
                  <video src={getMediaUrl(editingItem)} className="w-full h-full object-cover" preload="metadata" muted />
                ) : (
                  <img src={getMediaUrl(editingItem)} alt={editingItem.title} className="w-full h-full object-cover" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-brand-sunset focus:ring-2 focus:ring-brand-sunset/30 transition text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                <select
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white outline-none focus:border-brand-sunset focus:ring-2 focus:ring-brand-sunset/30 transition text-sm"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-brand-sunset focus:ring-2 focus:ring-brand-sunset/30 transition text-sm"
                  rows={2}
                  placeholder="Description optionnelle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remplacer le fichier (optionnel)</label>
                <label className="flex items-center justify-center w-full h-20 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-brand-sunset transition-colors group">
                  {editFile ? (
                    <div className="text-center">
                      <Check className="mx-auto text-green-500 mb-0.5" size={18} />
                      <p className="text-xs font-bold text-gray-700 truncate max-w-[200px]">{editFile.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-400 mb-1 group-hover:text-brand-sunset transition-colors" size={20} />
                      <p className="text-xs text-gray-400">Cliquez pour changer</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={e => setEditFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-dark hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={15} /> Enregistrer</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminUpload;