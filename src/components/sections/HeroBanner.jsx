import React, { useState, useEffect } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getMovieGenres, getTVGenres } from '../../api/tmdb';
import { useWatchlist } from '../../context/WatchlistContext';

const HeroBanner = ({ fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [genres, setGenres] = useState({});
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [data, movieGenres, tvGenres] = await Promise.all([
          fetchUrl(),
          getMovieGenres(),
          getTVGenres()
        ]);
        
        if (mounted && data.results) {
          setMovies(data.results.filter(m => m.backdrop_path).slice(0, 5));
          const genreMap = {};
          [...(movieGenres.genres || []), ...(tvGenres.genres || [])].forEach(g => {
            genreMap[g.id] = g.name;
          });
          setGenres(genreMap);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    loadData();
    return () => mounted = false;
  }, [fetchUrl]);

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) {
    return <div className="w-full h-[55vh] bg-[#212428] animate-pulse mb-8 rounded-[40px] mx-8 mt-2"></div>;
  }

  const currentMovie = movies[currentIndex];
  const bgUrl = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;
  const isTV = !!currentMovie.name;
  const linkUrl = isTV ? `/tv/${currentMovie.id}` : `/movie/${currentMovie.id}`;
  
  const currentGenres = currentMovie.genre_ids 
    ? currentMovie.genre_ids.map(id => genres[id]).filter(Boolean).slice(0, 2)
    : [];

  const inWatchlist = currentMovie ? isInWatchlist(currentMovie.id) : false;

  const handleWatchlist = (e) => {
    e.preventDefault();
    if (!currentMovie) return;
    
    if (inWatchlist) {
      removeFromWatchlist(currentMovie.id);
    } else {
      addToWatchlist({
        ...currentMovie,
        media_type: isTV ? 'tv' : 'movie'
      });
    }
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[55vh] px-4 md:px-8 mb-6 md:mb-10">
      <div className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden group shadow-lg">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <motion.img 
              animate={{ scale: 1.05 }}
              transition={{ duration: 6, ease: "linear" }}
              src={bgUrl} 
              alt={currentMovie.title || currentMovie.name} 
              className="w-full h-full object-cover"
            />
            
            {/* Soft Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#000E0A]/90 via-[#000E0A]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#000E0A] via-transparent to-transparent opacity-80"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="absolute inset-0 flex items-center p-6 md:p-14 z-10">
          <div className="max-w-xl mt-8 md:mt-0">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Badges */}
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-[#001F17] px-4 py-1.5 rounded-full flex items-center gap-2">
                  <span className="text-[#00E6BA] text-sm">🔥</span>
                  <span className="text-white text-xs font-bold">New Trending</span>
                </div>
              </div>

              {/* Genres below New Trending in screenshot but we can put them here */}
              <div className="flex items-center gap-2 mb-6">
                {currentGenres.map((genre, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    <span className="text-white text-xs font-medium">{genre}</span>
                  </div>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white font-bold leading-tight mb-3 md:mb-4 drop-shadow-xl">
                {currentMovie.title || currentMovie.name}
              </h1>

              {/* Overview */}
              <p className="text-white/80 text-sm md:text-sm font-medium max-w-lg mb-8 line-clamp-3 leading-relaxed">
                {currentMovie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <Link to={linkUrl} className="bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 flex-1 sm:flex-none">
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-black" />
                  Watch
                </Link>
                <button 
                  onClick={handleWatchlist}
                  className={`px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all border backdrop-blur-sm flex-1 sm:flex-none ${
                    inWatchlist ? 'bg-accent/20 border-accent/40 text-accent hover:bg-accent/30' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {inWatchlist ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
                  {inWatchlist ? 'In Watchlist' : 'My List'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;
