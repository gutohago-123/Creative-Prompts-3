export type Category = 'product' | 'logo' | 'social' | 'video' | 'branding';
export type Level = 'classic' | 'strong' | 'legendary';

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: Category;
  level: Level;
  type: 'short' | 'long';
  explanation: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  plan: 'free' | 'pro' | 'admin';
  credits: number;
  favorites: string[]; // Array of prompt IDs
  dailyGenerations: number;
  totalGenerations?: number;
  generationHistory?: {
    prompt: string;
    date: string;
    id: string;
  }[];
  lastGenerationDate: string; // ISO string
  isLifetime?: boolean;
}

export interface GeneratedPrompt {
  prompt: string;
  variations: string[];
  useCases: string[];
}

export interface GalleryPrompt {
  id: string;
  prompt: string;
  imageUrls: string[];
  explanation: string;
  type?: string;
  views: number;
  order: number;
}
