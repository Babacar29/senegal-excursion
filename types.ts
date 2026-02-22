export interface Excursion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  location: string;
  image: string; // Full URL from Firebase Storage
  description?: string;
}

export type Category =
  | 'Tous'
  | 'Dakar / Gorée'
  | 'Sine-Saloum'
  | 'Fathala'
  | 'Réserve de Bandia'
  | 'Mbour'
  | 'Village'
  | 'Autre';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}