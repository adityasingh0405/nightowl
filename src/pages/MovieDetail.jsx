import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check } from 'lucide-react';
import { getMovieDetails, getMovieCredits, getSimilarMovies, IMG_500, IMG_ORIGINAL } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/ui/MovieCard';
import ContentRow from '../components/sections/ContentRow';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailsData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id)
        ]);
        
        if (mounted) {
          setMovie(detailsData);
          setCast(creditsData.cast?.slice(0, 10) || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);

    return () => { mounted = false; };
  }, [id]);

  if (loading || !movie) {
    return <div className="min-h-screen bg-bg-base animate-pulse"></div>;
  }

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="pb-12 bg-transparent min-h-screen md:px-8">
      {/* Hero Backdrop Box */}
      <div className="relative h-[70vh] md:h-[60vh] w-full md:rounded-[40px] overflow-hidden shadow-2xl mb-8 border-b md:border border-white/5">
        <img 
          src={movie.backdrop_path ? `${IMG_ORIGINAL}${movie.backdrop_path}` : `${IMG_500}${movie.poster_path}`} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000E0A] via-[#000E0A]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#000E0A] via-[#000E0A]/80 to-transparent"></div>
        
        {/* Content overlaid on backdrop */}
        <div className="absolute inset-0 flex items-center p-6 md:p-14 z-10 pt-20 md:pt-14">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center w-full mt-auto md:mt-0">
            {/* Poster */}
            <div className="w-64 flex-shrink-0 hidden md:block">
              <img 
                src={`${IMG_500}${movie.poster_path}`} 
                alt={movie.title}
                className="w-full rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/10"
              />
            </div>

            {/* Details */}
            <div className="flex-1 w-full">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 drop-shadow-xl line-clamp-2 md:line-clamp-none">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-text-secondary mb-4 md:mb-6 font-medium">
                <span className="flex items-center gap-1 text-gold"><span className="text-[12px]">⭐</span> {movie.vote_average?.toFixed(1)}</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>{movie.runtime} min</span>
                <div className="flex gap-2">
                  {movie.genres?.map(g => (
                    <span key={g.id} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-white/80 text-[11px] md:text-base leading-relaxed max-w-3xl mb-6 md:mb-8 line-clamp-3 md:line-clamp-4">
                {movie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-10">
                <Link to={`/player?type=movie&id=${movie.id}`} className="flex-1 sm:flex-none justify-center bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-black" />
                  Watch
                </Link>
                <button 
                  onClick={handleWatchlist}
                  className={`flex-1 sm:flex-none justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold flex items-center gap-2 transition-all border backdrop-blur-sm ${
                    inWatchlist ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-transparent border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  {inWatchlist ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
                  <span className="hidden xs:inline">{inWatchlist ? 'In List' : 'My List'}</span>
                </button>
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-white/50">Top Cast</h3>
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                    {cast.map(person => (
                      <div key={person.id} className="w-20 flex-shrink-0 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-[#212428] border border-white/10 mb-2 shadow-lg">
                          {person.profile_path ? (
                            <img src={`${IMG_500}${person.profile_path}`} alt={person.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px]">No img</div>
                          )}
                        </div>
                        <p className="text-[10px] text-white font-bold line-clamp-1">{person.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      <div className="mt-8">
        <ContentRow title="Similar Movies" fetchUrl={() => getSimilarMovies(id)} />
      </div>

    </div>
  );
};

export default MovieDetail;
