import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return { user, authLoading, handleSignIn, handleSignOut };
}
