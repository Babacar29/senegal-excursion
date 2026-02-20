import PocketBase from 'pocketbase';
import { POCKETBASE_URL, MOCK_GALLERY } from '../constants';
import { GalleryItem } from '../types';

// Initialize PocketBase
export const pb = new PocketBase(POCKETBASE_URL);

// Disable auto-cancellation to avoid issues with React Strict Mode
pb.autoCancellation(false);

// Helper to check if file is a video based on extension
export const isVideo = (filename: string): boolean => {
  if (!filename) return false;
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext || '');
};

// Helper to safely get the image filename as a string
export const getImageFilename = (image: unknown): string => {
  if (Array.isArray(image)) return image[0] ?? '';
  if (typeof image === 'string') return image;
  return String(image ?? '');
};

// Helper to get image/video URL
export const getMediaUrl = (item: GalleryItem): string => {
  const filename = getImageFilename(item.image);
  if (!filename) return '';
  // If it's a full URL (mock data), return it directly
  if (filename.startsWith('http')) {
    return filename;
  }
  // Otherwise construct PB url
  return pb.files.getUrl(item, filename);
};

// Helper to detect Mixed Content Issues
const checkMixedContentError = () => {
  if (window.location.protocol === 'https:' && POCKETBASE_URL.startsWith('http:')) {
    return "ERREUR CRITIQUE : Le site est en HTTPS mais PocketBase est en HTTP. Le navigateur bloque la connexion pour sécurité ('Mixed Content'). Solution : Utilisez Ngrok pour avoir une URL https pour PocketBase.";
  }
  return null;
};

export const fetchGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const records = await pb.collection('gallery').getFullList<GalleryItem>({
      sort: '-created',
    });
    return records;
  } catch (error) {
    console.warn("PocketBase connection failed or collection missing. Using mock data.", error);
    return MOCK_GALLERY;
  }
};

export const uploadGalleryItem = async (formData: FormData): Promise<GalleryItem | null> => {
  try {
    const record = await pb.collection('gallery').create<GalleryItem>(formData);
    return record;
  } catch (error: any) {
    console.error("Error uploading to PocketBase:", error);
    let msg = "Erreur lors de l'upload.";

    // Check for Mixed Content first
    const mixedContentMsg = checkMixedContentError();
    if (mixedContentMsg) msg = mixedContentMsg;
    else if (error.status === 0) msg = "Impossible de contacter le serveur. Vérifiez que PocketBase est lancé.";
    else if (error.status === 400) msg = "Données invalides. Vérifiez la taille du fichier ou le format.";
    else if (error.status === 403) msg = "Permission refusée. Votre session a peut-être expiré.";

    alert(msg);
    throw error;
  }
};

export const isAuthenticated = () => {
  return pb.authStore.isValid && pb.authStore.isAdmin;
};

// Updated signature to return an object instead of boolean
export const loginAdmin = async (email: string, pass: string): Promise<{ ok: boolean; message?: string }> => {
  try {
    // Authenticate as Super Admin (Dashboard access)
    await pb.admins.authWithPassword(email, pass);
    return { ok: true };
  } catch (err: any) {
    console.error("Login Error Details:", err);

    let message = "Une erreur inconnue est survenue.";

    const mixedContentMsg = checkMixedContentError();

    // Status 0 means network error / CORS / Server down / Mixed Content
    if (mixedContentMsg) {
      message = mixedContentMsg;
    } else if (err.status === 0) {
      message = "Erreur de connexion (CORS ou Serveur éteint). Si vous utilisez Ngrok, vérifiez que l'URL est à jour.";
    } else if (err.status === 400) {
      message = "Email ou mot de passe incorrect.";
    } else if (err.status === 403) {
      message = "Accès interdit. Vérifiez vos droits admin.";
    }

    return { ok: false, message };
  }
};

export const logout = () => {
  pb.authStore.clear();
};

export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  try {
    await pb.collection('gallery').delete(id);
    return true;
  } catch (error: any) {
    console.error("Error deleting item:", error);
    const mixedContentMsg = checkMixedContentError();
    let msg = "Erreur lors de la suppression.";
    if (mixedContentMsg) msg = mixedContentMsg;
    else if (error.status === 0) msg = "Impossible de contacter le serveur.";
    else if (error.status === 403) msg = "Permission refusée.";
    else if (error.status === 404) msg = "Élément introuvable.";
    alert(msg);
    return false;
  }
};

export const updateGalleryItem = async (id: string, data: FormData): Promise<GalleryItem | null> => {
  try {
    const record = await pb.collection('gallery').update<GalleryItem>(id, data);
    return record;
  } catch (error: any) {
    console.error("Error updating item:", error);
    const mixedContentMsg = checkMixedContentError();
    let msg = "Erreur lors de la mise à jour.";
    if (mixedContentMsg) msg = mixedContentMsg;
    else if (error.status === 0) msg = "Impossible de contacter le serveur.";
    else if (error.status === 400) msg = "Données invalides.";
    else if (error.status === 403) msg = "Permission refusée.";
    alert(msg);
    return null;
  }
};