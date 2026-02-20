import { initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { MOCK_GALLERY } from '../constants';
import { GalleryItem } from '../types';
import { removeQuotes } from './firebase.utils';

// Initialize Firebase
const firebaseConfig = {
  apiKey: removeQuotes((import.meta as any).env.VITE_FIREBASE_API_KEY),
  authDomain: removeQuotes((import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: removeQuotes((import.meta as any).env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: removeQuotes((import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: removeQuotes((import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: removeQuotes((import.meta as any).env.VITE_FIREBASE_APP_ID),
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Enable local persistence for auth
setPersistence(auth, browserLocalPersistence).catch(() => {
  console.warn('Failed to enable auth persistence');
});

// State management
let currentUser: User | null = null;

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

// Helper functions
export const isVideo = (filename: string): boolean => {
  if (!filename) return false;
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext || '');
};

export const getImageFilename = (image: unknown): string => {
  if (Array.isArray(image)) return image[0] ?? '';
  if (typeof image === 'string') return image;
  return String(image ?? '');
};

// Get media URL from Firestore document
export const getMediaUrl = (item: GalleryItem): string => {
  // In Firebase, we store the full download URL directly in Firestore
  // So we can return it directly
  if (item.image?.startsWith('http')) {
    return item.image;
  }
  // Fallback to empty string if no image
  return item.image || '';
};

// Authentication functions
export const loginAdmin = async (
  email: string,
  pass: string
): Promise<{ ok: boolean; message?: string }> => {
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    return { ok: true };
  } catch (err: any) {
    console.error('Login Error:', err);

    let message = 'Une erreur inconnue est survenue.';

    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      message = 'Email ou mot de passe incorrect.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Trop de tentatives infructueuses. Réessayez plus tard.';
    } else if (err.code === 'auth/network-request-failed') {
      message = 'Erreur de connexion réseau. Vérifiez votre connexion internet.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Email invalide.';
    }

    return { ok: false, message };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

// Gallery functions
export const fetchGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const q = query(collection(db, 'gallery'), orderBy('created', 'desc'));
    const querySnapshot = await getDocs(q);

    const items: GalleryItem[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      collectionId: doc.ref.parent.id,
      collectionName: 'gallery',
      created: doc.data().created?.toDate?.().toISOString() || new Date().toISOString(),
      updated: doc.data().updated?.toDate?.().toISOString() || new Date().toISOString(),
      title: doc.data().title,
      location: doc.data().location,
      image: doc.data().image, // Firebase stores the download URL directly
      description: doc.data().description || '',
    }));

    return items;
  } catch (error) {
    console.warn('Firestore fetch failed. Using mock data.', error);
    return MOCK_GALLERY;
  }
};

export const uploadGalleryItem = async (formData: FormData): Promise<GalleryItem | null> => {
  try {
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;

    if (!file || !title || !location) {
      throw new Error('Données manquantes');
    }

    // Upload file to Firebase Storage
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `gallery/${filename}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, 'gallery'), {
      title,
      location,
      description,
      image: downloadURL, // Store the download URL
      created: new Date(),
      updated: new Date(),
    });

    return {
      id: docRef.id,
      collectionId: docRef.parent.id,
      collectionName: 'gallery',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      title,
      location,
      image: downloadURL,
      description,
    };
  } catch (error: any) {
    console.error('Error uploading to Firebase:', error);
    let msg = 'Erreur lors de l\'upload.';

    if (error.code === 'storage/unauthorized') {
      msg = 'Permission refusée. Vérifiez les règles de sécurité Firebase.';
    } else if (error.code === 'storage/retry-limit-exceeded') {
      msg = 'Erreur réseau. Réessayez avec un fichier plus petit.';
    } else if (error.message === 'Données manquantes') {
      msg = 'Tous les champs sont obligatoires.';
    }

    alert(msg);
    throw error;
  }
};

export const updateGalleryItem = async (
  id: string,
  data: FormData
): Promise<GalleryItem | null> => {
  try {
    const docRef = doc(db, 'gallery', id);
    const file = data.get('image') as File | null;
    const title = data.get('title') as string;
    const location = data.get('location') as string;
    const description = data.get('description') as string;

    let updateData: DocumentData = {
      title,
      location,
      description,
      updated: new Date(),
    };

    // If a new file is provided, upload it
    if (file) {
      try {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `gallery/${filename}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        updateData.image = downloadURL;
      } catch (storageError) {
        console.error('File upload error:', storageError);
        throw new Error('Erreur lors de l\'upload du fichier');
      }
    }

    await updateDoc(docRef, updateData);

    return {
      id,
      collectionId: 'gallery',
      collectionName: 'gallery',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      title,
      location,
      image: updateData.image || '',
      description,
    };
  } catch (error: any) {
    console.error('Error updating item:', error);
    const msg = error.message || 'Erreur lors de la mise à jour.';
    alert(msg);
    return null;
  }
};

export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  try {
    // First try to delete from Firestore to get the image URL
    const docRef = doc(db, 'gallery', id);
    // Note: We're not fetching the doc first to avoid extra reads
    // If you need to delete the image file from storage, you'll need to modify this
    await deleteDoc(docRef);
    return true;
  } catch (error: any) {
    console.error('Error deleting item:', error);
    let msg = 'Erreur lors de la suppression.';

    if (error.code === 'permission-denied') {
      msg = 'Permission refusée.';
    } else if (error.code === 'not-found') {
      msg = 'Élément introuvable.';
    }

    alert(msg);
    return false;
  }
};
// Admin management functions
/**
 * Obtenir l'utilisateur actuellement connecté
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Obtenir les informations admin de l'utilisateur connecté
 */
export const getAdminUser = async () => {
  const user = getCurrentUser();
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: user.metadata.creationTime,
    lastSignIn: user.metadata.lastSignInTime,
  };
};

/**
 * Vérifier si la session admin est valide
 */
export const isValidAdminSession = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Vérifier que l'email est valide
  if (!user.email) return false;

  // La session est valide si l'utilisateur est connecté et a un email
  return true;
};

/**
 * Recharger les informations de l'utilisateur (utile après changements de permissions)
 */
export const refreshAdminSession = async (): Promise<boolean> => {
  try {
    const user = getCurrentUser();
    if (user) {
      await user.reload();
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Error refreshing admin session:', error);
    return false;
  }
};

/**
 * Obtenir l'ID token de l'utilisateur pour appels API sécurisés
 */
export const getAdminToken = async (): Promise<string | null> => {
  try {
    const user = getCurrentUser();
    if (!user) return null;
    return await user.getIdToken();
  } catch (error: any) {
    console.error('Error getting admin token:', error);
    return null;
  }
};

/**
 * Log des actions admin (pour audit trail)
 */
export const logAdminAction = async (
  action: string,
  details: Record<string, any> = {}
): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) return;

    // Stocker les logs dans une collection Firestore séparée
    await addDoc(collection(db, 'adminLogs'), {
      userId: user.uid,
      userEmail: user.email,
      action,
      details,
      timestamp: new Date(),
      ipInfo: await getClientInfo(),
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Ne pas bloquer si le logging échoue
  }
};

/**
 * Obtenir des informations basiques sur le client
 */
const getClientInfo = async (): Promise<Record<string, any>> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return {
      ip: data.ip,
      timestamp: new Date().toISOString(),
    };
  } catch {
    return {
      timestamp: new Date().toISOString(),
    };
  }
};