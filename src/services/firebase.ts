import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, increment, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { UserProfile } from '../types';

// Fetch firebase config from public folder at runtime
async function getFirebaseConfig() {
  const response = await fetch('/firebase-config.json');
  return await response.json();
}

let auth: any;
let db: any;
let storage: any;
let googleProvider: any;

// Initialize Firebase with lazy loading
async function initFirebase() {
  const firebaseConfig = await getFirebaseConfig();
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // Use Database ID from JSON
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  return { auth, db, storage, googleProvider };
}

// We need to export these, so we'll init them immediately
const firebasePromise = initFirebase();

export { auth, db, storage, googleProvider, firebasePromise, onAuthStateChanged };
export type { User };


// Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

export async function signInWithGoogle() {
  const { auth, googleProvider } = await firebasePromise; // Wait for initialization
  try {
    console.log('Attempting Google sign-in...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('Google sign-in successful:', user.uid);
    await ensureUserExists(user);
    return user;
  } catch (error: any) {
    console.error('CRITICAL: Firebase Auth Error Details:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    if (error.code === 'auth/unauthorized-domain') {
       console.error('FIX: You MUST add "creativeprompts.netlify.app" to Authorized Domains in Firebase Console -> Authentication -> Settings.');
    }
    if (error.code === 'auth/popup-blocked') {
       console.error('FIX: Your browser blocked the pop-up window.');
    }
    throw error;
  }
}

export async function signInWithEmail(email: string, pass: string) {
  const { auth } = await firebasePromise;
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Email:', error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, pass: string, name?: string) {
  const { auth } = await firebasePromise;
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    
    if (name) {
      await updateProfile(user, { displayName: name });
    }
    
    await ensureUserExists(user);
    return user;
  } catch (error) {
    console.error('Error signing up with Email:', error);
    throw error;
  }
}

async function ensureUserExists(user: User) {
  const { db } = await firebasePromise;
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        plan: 'free',
        credits: 10,
        favorites: [],
        dailyGenerations: 0,
        lastGenerationDate: new Date().toISOString()
      };
      await setDoc(userRef, newUser);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const { db } = await firebasePromise;
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function toggleFavorite(uid: string, promptId: string, isFavorite: boolean) {
  const { db } = await firebasePromise;
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      favorites: isFavorite ? arrayUnion(promptId) : arrayRemove(promptId)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveGeneration(uid: string, prompt: string) {
  const { db } = await firebasePromise;
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const generationId = Math.random().toString(36).substring(2, 15);
    await updateDoc(userRef, {
      dailyGenerations: increment(1),
      totalGenerations: increment(1),
      generationHistory: arrayUnion({
        id: generationId,
        prompt: prompt,
        date: new Date().toISOString()
      })
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
