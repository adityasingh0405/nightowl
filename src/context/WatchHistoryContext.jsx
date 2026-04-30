import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "./AuthContext";

const WatchHistoryContext = createContext();

export function WatchHistoryProvider({ children }) {
  const { user } = useAuth();
  // We store all watch histories in a single object mapped by userId
  const [allHistories, setAllHistories] = useLocalStorage("streamverse_history", {});
  
  // Current user's history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      setHistory(allHistories[user.id] || []);
    } else {
      setHistory([]);
    }
  }, [user, allHistories]);

  const addToHistory = (item) => {
    if (!user) return;
    
    // Remove if it already exists so we can move it to the front
    const filteredHistory = history.filter(h => h.id !== item.id);
    
    // Create minimal history object
    const historyItem = {
      id: item.id,
      title: item.title || item.name,
      img: item.backdrop_path || item.poster_path,
      media_type: item.title ? 'movie' : 'tv',
      timestamp: Date.now()
    };

    const updatedHistory = [historyItem, ...filteredHistory].slice(0, 10); // Keep max 10
    
    setHistory(updatedHistory);
    setAllHistories(prev => ({
      ...prev,
      [user.id]: updatedHistory
    }));
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
