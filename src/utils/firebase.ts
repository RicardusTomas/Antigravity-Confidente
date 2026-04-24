import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDuN-8EFfP_uwgESlRuUlbq7_cpSOagHTc",
  authDomain: "confidente-app.firebaseapp.com",
  projectId: "confidente-app",
  storageBucket: "confidente-app.firebasestorage.app",
  messagingSenderId: "39727237893",
  appId: "1:39727237893:web:ba39efc65d8f3162ad456c",
  measurementId: "G-J1ESN52GXT"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const firebaseService = {
  async saveEntry(userId: string, entry: any) {
    try {
      const userRef = doc(db, 'users', userId);
      const entriesRef = collection(userRef, 'entries');
      await addDoc(entriesRef, { ...entry, createdAt: new Date() });
    } catch (e) {
      console.error('Error saving entry:', e);
    }
  },

  async deleteEntry(userId: string, entryId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const entryRef = doc(collection(userRef, 'entries'), entryId);
      await deleteDoc(entryRef);
    } catch (e) {
      console.error('Error deleting entry:', e);
    }
  },

  async addChatMessage(userId: string, message: any) {
    try {
      const userRef = doc(db, 'users', userId);
      const chatsRef = collection(userRef, 'chats');
      await addDoc(chatsRef, { ...message, timestamp: new Date() });
    } catch (e) {
      console.error('Error saving chat message:', e);
    }
  },

  async clearChats(userId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const chatsRef = collection(userRef, 'chats');
      const snapshot = await getDocs(chatsRef);
      snapshot.docs.forEach(async (docSnap) => {
        await deleteDoc(doc(chatsRef, docSnap.id));
      });
    } catch (e) {
      console.error('Error clearing chats:', e);
    }
  },

  async saveBreathingSession(userId: string, session: any) {
    try {
      const userRef = doc(db, 'users', userId);
      const sessionsRef = collection(userRef, 'breathingSessions');
      await addDoc(sessionsRef, { ...session, createdAt: new Date() });
    } catch (e) {
      console.error('Error saving breathing session:', e);
    }
  },
};

export default app;