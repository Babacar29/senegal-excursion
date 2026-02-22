import { GalleryItem } from './types';

// Mock data used if PocketBase is not connected
export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: '1',
    collectionId: 'mock',
    collectionName: 'gallery',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    title: "Maison des Esclaves",
    location: "Dakar / Gorée",
    image: "https://images.unsplash.com/photo-1596489852237-773a4d048493?q=80&w=2070&auto=format&fit=crop",
    description: "Visite émouvante de l'île historique de Gorée."
  },
  {
    id: '3',
    collectionId: 'mock',
    collectionName: 'gallery',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    title: "Safari à Bandia",
    location: "Réserve de Bandia",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    description: "Observation des girafes, rhinocéros et zèbres en liberté."
  },
  {
    id: '5',
    collectionId: 'mock',
    collectionName: 'gallery',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    title: "Mangrove du Sine-Saloum",
    location: "Sine-Saloum",
    image: "https://images.unsplash.com/photo-1533224749348-1548545e6988?q=80&w=2070&auto=format&fit=crop",
    description: "Balade en pirogue au cœur du delta."
  },
  {
    id: '6',
    collectionId: 'mock',
    collectionName: 'gallery',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    title: "Marche avec les Lions",
    location: "Fathala",
    image: "https://images.unsplash.com/photo-1615234503722-192667ae967a?q=80&w=2070&auto=format&fit=crop",
    description: "Expérience unique à la réserve de Fathala."
  }
];

export const CONTACT_PHONE = "+221785216296"; // Replace with actual number
export const CONTACT_EMAIL = "dchristophe507@gmail.com";

// Firebase is now used instead of PocketBase
