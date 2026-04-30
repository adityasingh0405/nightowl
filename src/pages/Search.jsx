import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti } from '../api/tmdb';
import MovieCard from '../components/ui/MovieCard';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, movie, tv

  useEffect(() => {
    let mounted = true;
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchMulti(query);
        if (mounted) {
          // Filter out people, only keep movies and tv shows
          const mediaResults = data.results?.filter(item => item.media_type === 'movie' || item.media_type === 'tv') || [];
          setResults(mediaResults);
          setLoading(false);
        }
      } catch (error) {
        console.error("Search failed:", error);
        if (mounted) setLoading(false);
      }
    };

    // Simple debounce via timeout
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const filteredResults = results.filter(item => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  return (
    <div className="pt-24 px-8 pb-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-heading mb-6 flex items-center gap-3">
          <SearchIcon className="w-8 h-8 text-accent" />
          {query ? `Search Results for "${query}"` : 'Search StreamVerse'}
        </h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {['all', 'movie', 'tv'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all border ${
                filter === type 
                  ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]' 
                  : 'bg-bg-raised border-white/10 text-text-secondary hover:text-white hover:border-white/30'
              }`}
            >
              {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-bg-raised animate-pulse rounded-2xl border border-white/5"></div>
          ))}
        </div>
      ) : query && filteredResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-bg-raised rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-xl font-heading text-white mb-2">No results found</h3>
          <p className="text-text-secondary text-sm">We couldn't find anything matching "{query}". Try another search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredResults.map(item => (
            <MovieCard 
              key={item.id} 
              item={item} 
              isTV={item.media_type === 'tv'} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
