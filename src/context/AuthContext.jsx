import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setCurrentUser({
              id: user.uid,
              email: user.email,
              name: user.displayName,
              ...userDocSnap.data()
            });
          } else {
            setCurrentUser({
              id: user.uid,
              email: user.email,
              name: user.displayName
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update auth profile
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });
    
    return user;
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  const updateUser = async (updates) => {
    if (!currentUser) return;
    
    try {
      // If updating name, update Firebase Auth profile too
      if (updates.name) {
        await updateProfile(auth.currentUser, { displayName: updates.name });
      }

      // Update Firestore document (using setDoc with merge to ensure it creates if missing)
      const userRef = doc(db, "users", currentUser.id);
      await setDoc(userRef, updates, { merge: true });

      // Update local state
      setCurrentUser(prev => ({ ...prev, ...updates }));
      return { ...currentUser, ...updates };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const getPassword = () => {
    return "Encrypted by Firebase";
  };

  const value = {
    user: currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateUser,
    getPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
