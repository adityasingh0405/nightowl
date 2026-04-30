import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/ui/MovieCard';
import { Bookmark, Film } from 'lucide-react';

const Watchlist = () => {
  const { watchlist } = useWatchlist();

  return (
    <div className="pt-24 px-8 pb-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-heading mb-2 flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-accent fill-accent" />
          My Watchlist
        </h1>
        <p className="text-text-secondary text-sm">Movies and TV shows you've saved to watch later.</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-bg-raised/30 rounded-3xl border border-white/5 backdrop-blur-sm">
          <div className="w-24 h-24 bg-bg-raised rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <Film className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-2xl font-heading text-white mb-2">Your watchlist is empty</h3>
          <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
            Looks like you haven't added anything to your watchlist yet. Explore our collection and click the plus icon to save your favorites here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map(item => (
            <MovieCard 
              key={item.id} 
              item={item} 
              isTV={item.media_type === 'tv' || item.name} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
