import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Real-time listener for a Firestore collection.
 * Calls onData with the mapped array of documents.
 * Returns an unsubscribe function.
 */
export function listenCollection<T>(
  collectionName: string,
  onData: (items: T[]) => void,
  sortField?: string
): () => void {
  try {
    const colRef = collection(db, collectionName);
    const q = sortField ? query(colRef, orderBy(sortField, 'asc')) : colRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: T[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
          });
          onData(items);
        }
      },
      (error) => {
        console.warn(`Firestore read notice for ${collectionName}:`, error.message);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn(`Could not attach listener for ${collectionName}:`, err.message);
    return () => {};
  }
}

/**
 * Real-time listener for a single Firestore document.
 */
export function listenDocument<T>(
  collectionName: string,
  docId: string,
  onData: (data: T) => void
): () => void {
  try {
    const docRef = doc(db, collectionName, docId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData({ id: snapshot.id, ...snapshot.data() } as unknown as T);
        }
      },
      (error) => {
        console.warn(`Firestore doc read notice for ${collectionName}/${docId}:`, error.message);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn(`Could not attach doc listener for ${collectionName}/${docId}:`, err.message);
    return () => {};
  }
}

/**
 * Save or update a specific document in Firestore with merge.
 */
export async function saveDocument(collectionName: string, docId: string, data: any) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.warn(`Failed writing to Firestore ${collectionName}/${docId}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Submit an anonymous message to Firestore matching security rules.
 */
export async function submitAnonymousMessage(content: string, senderName?: string, senderEmail?: string) {
  try {
    const colRef = collection(db, 'anonymousMessages');
    const payload: any = {
      content: content.trim(),
      createdAt: serverTimestamp(),
      isRead: false,
      isPublished: false,
      isArchived: false
    };
    if (senderName) payload.senderName = senderName.trim();
    if (senderEmail) payload.senderEmail = senderEmail.trim();

    const docRef = await addDoc(colRef, payload);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.warn('Direct Firestore anonymous message failed:', error.message);
    // Return error so caller can fallback to API route or local store
    return { success: false, error: error.message };
  }
}

/**
 * Update public activity telemetry in Firestore.
 */
export async function updateActivityDoc(activityData: any) {
  try {
    const docRef = doc(db, 'publicActivity', 'current');
    await setDoc(
      docRef,
      {
        ...activityData,
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
