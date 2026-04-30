import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "./AuthContext";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { user } = useAuth();
  // We store all watchlists in a single object mapped by userId
  const [allWatchlists, setAllWatchlists] = useLocalStorage("streamverse_watchlists", {});
  
  // Current user's watchlist
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      setWatchlist(allWatchlists[user.id] || []);
    } else {
      setWatchlist([]);
    }
  }, [user, allWatchlists]);

  const addToWatchlist = (item) => {
    if (!user) return false;
    
    // Check if already in watchlist
    if (watchlist.some(w => w.id === item.id)) return true;

    const updatedWatchlist = [...watchlist, item];
    setWatchlist(updatedWatchlist);
    setAllWatchlists(prev => ({
      ...prev,
      [user.id]: updatedWatchlist
    }));
    return true;
  };

  const removeFromWatchlist = (itemId) => {
    if (!user) return;
    
    const updatedWatchlist = watchlist.filter(item => item.id !== itemId);
    setWatchlist(updatedWatchlist);
    setAllWatchlists(prev => ({
      ...prev,
      [user.id]: updatedWatchlist
    }));
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
