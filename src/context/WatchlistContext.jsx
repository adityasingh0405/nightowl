import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const watchlistRef = collection(db, `users/${user.id}/watchlist`);
      unsubscribe = onSnapshot(watchlistRef, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setWatchlist(items);
      });
    } else {
      setWatchlist([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const addToWatchlist = async (item) => {
    if (!user) return false;
    
    if (watchlist.some(w => w.id === item.id)) return true;

    // Optimistically update UI
    setWatchlist(prev => [...prev, item]);

    try {
      const docRef = doc(db, `users/${user.id}/watchlist`, item.id.toString());
      await setDoc(docRef, item);
      return true;
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
      // Revert optimistic update
      setWatchlist(prev => prev.filter(w => w.id !== item.id));
      return false;
    }
  };

  const removeFromWatchlist = async (itemId) => {
    if (!user) return;
    
    const itemToRemove = watchlist.find(w => w.id === itemId);
    
    // Optimistically update UI
    setWatchlist(prev => prev.filter(w => w.id !== itemId));

    try {
      const docRef = doc(db, `users/${user.id}/watchlist`, itemId.toString());
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      // Revert optimistic update
      if (itemToRemove) {
        setWatchlist(prev => [...prev, itemToRemove]);
      }
    }
  };

  const isInWatchlist = (itemId) => {
    return watchlist.some(item => item.id === itemId);
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
