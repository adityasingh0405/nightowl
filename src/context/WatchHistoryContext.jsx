import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";

const WatchHistoryContext = createContext();

export function WatchHistoryProvider({ children }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const historyRef = collection(db, `users/${user.id}/history`);
      const q = query(historyRef, orderBy("timestamp", "desc"), limit(12));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setHistory(items);
      });
    } else {
      setHistory([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const addToHistory = async (item) => {
    if (!user) return;
    
    const historyItem = {
      id: item.id,
      title: item.title || item.name || "Unknown Title",
      img: item.backdrop_path || item.poster_path || "",
      media_type: item.title ? 'movie' : 'tv',
      timestamp: Date.now()
    };

    // Optimistically update UI
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== item.id);
      return [historyItem, ...filtered].slice(0, 10);
    });

    try {
      const docRef = doc(db, `users/${user.id}/history`, item.id.toString());
      await setDoc(docRef, historyItem);
    } catch (err) {
      console.error("Failed to add to watch history:", err);
    }
  };

  const value = {
    history,
    addToHistory
  };

  return <WatchHistoryContext.Provider value={value}>{children}</WatchHistoryContext.Provider>;
}

export function useWatchHistory() {
  return useContext(WatchHistoryContext);
}
