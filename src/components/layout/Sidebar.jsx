import React, { useState, useEffect } from 'react';
import { Play, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUpcomingMovies, IMG_500 } from '../../api/tmdb';
import { useWatchHistory } from '../../context/WatchHistoryContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [trailers, setTrailers] = useState([]);
  const { history } = useWatchHistory();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchTrailers = async () => {
      try {
        const data = await getUpcomingMovies();
        if (mounted && data.results) {
          setTrailers(data.results.slice(0, 2)); // Get top 2 upcoming
        }
      } catch (err) {
        console.error("Failed to load trailers", err);
      }
    };
    fetchTrailers();
    return () => { mounted = false; };
  }, []);



  return (
    <aside className="w-[320px] bg-transparent h-full hidden md:flex flex-col p-6 overflow-y-auto hide-scrollbar z-20">
      
      {/* Brand Logo - Moved from Navbar */}
      <div className="flex justify-center w-full mb-[10px] -mt-[14px]">
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer hover:opacity-80 transition-opacity overflow-hidden rounded-3xl"
        >
          <div className="w-20 h-20 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-[1.7] invert brightness-200 drop-shadow-[0_0_8px_rgba(0,230,186,0.4)] hover:scale-[1.8] transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* New Trailer Section */}
      <div className="bg-[#212428] rounded-3xl p-4 mb-6 shadow-lg border border-white/5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-accent-alt">🔥</span> New Trailer 
          <span className="text-[10px] text-text-secondary font-normal ml-auto">Sort by: Today ↕</span>
        </h3>

        <div className="space-y-4">
          {trailers.map((movie) => (
            <div 
              key={movie.id} 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="relative h-32 rounded-2xl overflow-hidden group cursor-pointer shadow-md"
            >
              <img 
                src={`${IMG_500}${movie.backdrop_path || movie.poster_path}`} 
                alt={movie.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/95 via-bg-base/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="pr-2">
                  <p className="text-xs font-bold text-white mb-0.5 line-clamp-1">{movie.title}</p>
                  <p className="text-[10px] text-text-secondary capitalize">{movie.original_language || 'Kingdom'}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center group-hover:bg-accent transition-colors flex-shrink-0">
                  <Play fill="black" className="w-3 h-3 text-black ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Watching Section */}
      <div className="bg-[#212428] rounded-3xl p-5 shadow-lg border border-white/5 flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold text-white mb-4">Continue watching</h3>
        
        <div className="space-y-4 overflow-y-auto hide-scrollbar flex-1">
          {isAuthenticated && history.length > 0 ? (
            history.slice(0, 4).map((item) => (
              <div 
                key={`${item.media_type}-${item.id}-${item.timestamp}`} 
                onClick={() => navigate(`/${item.media_type}/${item.id}`)}
                className="flex items-center gap-3 group cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={`${IMG_500}${item.img}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white mb-0.5 group-hover:text-accent transition-colors truncate">{item.title}</p>
                  <p className="text-[10px] text-text-secondary">2h 30 min</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-colors flex-shrink-0">
                  <Play fill="currentColor" className="w-3 h-3 text-white group-hover:text-black ml-0.5" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-text-secondary">No recent activity.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
