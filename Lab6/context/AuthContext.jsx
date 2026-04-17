import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      setInitializing(false);
    });
    return unsub;
  }, []);

  const value = useMemo(
    () => ({
      user,
      uid: user?.uid ?? null,
      isAuthenticated: user !== null,
      initializing,

      async register(email, password) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: cred.user.email,
          createdAt: serverTimestamp(),
        });
        return cred.user;
      },

      async login(email, password) {
        const cred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        return cred.user;
      },

      async logout() {
        await signOut(auth);
      },

      async sendReset(email) {
        await sendPasswordResetEmail(auth, email.trim());
      },

      async reauthenticate(password) {
        if (!auth.currentUser?.email) {
          throw new Error('Користувач не автентифікований');
        }
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          password,
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      },

      async changePassword(currentPassword, newPassword) {
        if (!auth.currentUser) throw new Error('Не автентифіковано');
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword,
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
      },

      async verifyPassword(password) {
        if (!auth.currentUser?.email) throw new Error('Не автентифіковано');
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          password,
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      },

      async deleteAccount() {
        if (!auth.currentUser) throw new Error('Не автентифіковано');
        const uid = auth.currentUser.uid;
        try {
          await deleteDoc(doc(db, 'users', uid));
        } catch (err) {
          console.warn('Firestore doc delete failed:', err);
        }
        await deleteUser(auth.currentUser);
      },
    }),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
