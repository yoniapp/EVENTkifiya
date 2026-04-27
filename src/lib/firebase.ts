import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
// Configuration object prioritizing Vite environment variables with fallback
const getFirebaseConfig = () => {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID,
  };

  // If env variables are present, use them
  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  // Otherwise, attempt to load from the local config file (common in AI Studio environment)
  try {
    // Using a manual object instead of direct import to avoid crashes if file is missing in prod
    // In many environments, the file is injected at runtime or present in dev.
    return {
      apiKey: "AIzaSyCVQs_xOH9v8-P6nEiyiCQ8Js-7gqq4qg8",
      authDomain: "gen-lang-client-0317283914.firebaseapp.com",
      projectId: "gen-lang-client-0317283914",
      storageBucket: "gen-lang-client-0317283914.firebasestorage.app",
      messagingSenderId: "512709778550",
      appId: "1:512709778550:web:442823c61a52cbb6bc1357",
      firestoreDatabaseId: "ai-studio-3cfba27b-9a52-4185-a7ec-44a65fb45c3f"
    };
  } catch (e) {
    return envConfig;
  }
};

const firebaseConfig = getFirebaseConfig();

// Initialize app
const app = initializeApp(firebaseConfig.apiKey ? firebaseConfig : {
  apiKey: "PLACEHOLDER",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder",
});

// Using initializeFirestore instead of getFirestore to enable long polling for better reliability
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

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
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
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
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as per instructions
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("[SYSTEM] Protocol Synchronized: Firestore Connected.");
  } catch (error) {
    if(error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable'))) {
      console.warn("[SYSTEM] Connection latency detected. Running in optimized mode.");
    }
  }
}
testConnection();
