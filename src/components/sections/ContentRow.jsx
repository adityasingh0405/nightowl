import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../ui/MovieCard';
import { useNavigate } from 'react-router-dom';

const ContentRow = ({ title, fetchUrl, isTV = false }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const data = await fetchUrl();
        if (mounted) {
          setMovies(data.results || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching row data:", error);
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => mounted = false;
  }, [fetchUrl]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSeeAll = () => {
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/category/${slug}`);
  };

  if (loading) {
    return (
      <div className="mb-10 px-8">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[200px] aspect-[4/5] flex-shrink-0 relative overflow-hidden rounded-[32px] bg-[#212428] border border-white/5">
               <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="mb-12 group relative">
      <div className="px-8 flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <button 
          onClick={handleSeeAll}
          className="text-xs font-bold text-white transition-colors bg-[#212428] hover:bg-white/20 px-4 py-2 rounded-full cursor-pointer shadow-sm"
        >
          See All
        </button>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 shadow-lg text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar px-8 pb-8 pt-2 snap-x snap-mandatory"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-[220px] lg:w-[240px] snap-start flex-shrink-0">
              <MovieCard item={movie} isTV={isTV} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 shadow-lg text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
