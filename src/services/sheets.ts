import { GalleryPrompt, Prompt } from '../types';
import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, updateDoc, increment, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

// Use the server-side proxy to avoid the CORS issues
const SHEETS_URL = window.location.origin + '/api/sheets'; 

// Global cache to speed up detail page and repeated visits
let cachedPrompts: GalleryPrompt[] | null = null;
let lastFetchTime = 0;
const CLIENT_CACHE_DURATION = 300000; // 5 minutes 

export async function fetchPrompts(): Promise<Prompt[]> {
  try {
    console.log('Fetching prompts from:', SHEETS_URL);
    const response = await fetch(SHEETS_URL);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DEBUG: HTTP error fetching prompts:', response.status, errorText);
      return [];
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Expected array from sheets API, got:', typeof data);
      return [];
    }
    
    // Filter out empty rows and ensure unique IDs
    const validData = data.filter((item: any) => item.prompts && String(item.prompts).trim() !== '');
    const seenIds = new Set<string>();
    
    return validData.map((item: any, index: number) => {
      let id = item.id ? String(item.id) : `prompt_${index}`;
      if (seenIds.has(id)) {
        id = `${id}_${index}`;
      }
      seenIds.add(id);
      
      return {
        id,
        title: item.prompts?.substring(0, 30) || 'Untitled',
        prompt: item.prompts || '',
        category: 'product',
        level: 'classic',
        type: String(item.type || 'short').trim(),
        explanation: item.set || 'استخدم هذا البرومبت للحصول على نتائج سينمائية مذهلة.',
        imageUrl: item.images || '',
        tags: [],
        featured: true
      } as Prompt;
    });
  } catch (error) {
    console.error('Error fetching prompts details:', error);
    return [];
  }
}

export async function fetchGalleryPrompts(force = false): Promise<GalleryPrompt[]> {
  try {
    const now = Date.now();
    if (!force && cachedPrompts && (now - lastFetchTime < CLIENT_CACHE_DURATION)) {
      console.log('Returning client-side cached gallery prompts');
      return cachedPrompts;
    }

    console.log('DEBUG: Attempting to fetch from:', SHEETS_URL);
    const response = await fetch(SHEETS_URL);
    
    // Log the exact status code
    console.log('DEBUG: Received HTTP Status:', response.status);
    
    const textResponse = await response.text();
    console.log('DEBUG: Raw Response Text:', textResponse);
    
    if (!response.ok) {
        console.error('HTTP error fetching gallery prompts:', response.status);
        return [];
    }
    
    // Parse the text we already read
    let data;
    try {
        data = JSON.parse(textResponse);
    } catch (parseError) {
        console.error('Error parsing response as JSON, likely HTML:', parseError);
        return [];
    }
    
    console.log('DEBUG: Data received and parsed:', data);
    
    // Fix: Properly define validData from the parsed data, and filter out empty rows
    const validData = Array.isArray(data) 
      ? data.filter((item: any) => item && (String(item.prompts || '').trim() !== '')) 
      : [];
    
    // Fetch ALL view stats in one go to avoid N parallel requests
    const statsMap: Record<string, number> = {};
    try {
      const statsSnapshot = await getDocs(collection(db, 'prompt_stats'));
      statsSnapshot.forEach(doc => {
        statsMap[doc.id] = doc.data().views || 0;
      });
    } catch (statsError) {
      console.error('Error fetching all stats:', statsError);
    }

    const seenIds = new Set<string>();
    const prompts = validData.map((item: any, index: number) => {
      let id = item.id ? String(item.id) : `prompt_${index}`;
      if (seenIds.has(id)) {
        id = `${id}_${index}`;
      }
      seenIds.add(id);
      
      return {
        id,
        prompt: item.prompts || '',
        imageUrls: Array.isArray(item.images) 
          ? item.images 
          : (item.images ? item.images.split(/\r?\n|,/).map((img: string) => img.trim()).filter(Boolean) : []),
        explanation: item.set || 'استخدم هذا البرومبت للحصول على نتائج سينمائية مذهلة.',
        type: String(item.type || '').trim(),
        views: statsMap[id] || 0,
        order: index + 1
      } as GalleryPrompt;
    });

    const sortedPrompts = prompts.sort((a, b) => a.order - b.order);
    cachedPrompts = sortedPrompts;
    lastFetchTime = now;
    return sortedPrompts;
  } catch (error) {
    console.error('Error fetching gallery prompts details (catch block):', error);
    return cachedPrompts || [];
  }
}

export async function incrementPromptViews(promptId: string) {
  const path = `prompt_stats/${promptId}`;
  try {
    const docRef = doc(db, 'prompt_stats', promptId);
    await setDoc(docRef, {
      views: increment(1)
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
