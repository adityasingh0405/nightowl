import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getTrendingTV, 
  getAnimationMovies,
  getSimilarMovies,
  getSimilarTV
} from '../api/tmdb';
import MovieCard from '../components/ui/MovieCard';
import { ArrowLeft } from 'lucide-react';

const categoryMap = {
  'trending-movies': { title: 'Trending Movies', fetchFn: getTrendingMovies, isTV: false },
  'popular-on-NiteOwl': { title: 'Popular on NiteOwl', fetchFn: getPopularMovies, isTV: false },
  'top-rated-classics': { title: 'Top Rated Classics', fetchFn: getTopRatedMovies, isTV: false },
  'trending-tv-shows': { title: 'Trending TV Shows', fetchFn: getTrendingTV, isTV: true },
  'top-animation': { title: 'Top Animation', fetchFn: getAnimationMovies, isTV: false },
  'similar-movies': { title: 'Similar Movies', fetchFn: getSimilarMovies, isTV: false }, // Note: needs ID to work properly, but we'll fallback
  'similar-tv-shows': { title: 'Similar TV Shows', fetchFn: getSimilarTV, isTV: true },
};

const Category = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryInfo = categoryMap[slug];

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!categoryInfo) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // We only fetch page 1 for now, but a real app would support pagination
        const data = await categoryInfo.fetchFn();
        if (mounted && data.results) {
          setMovies(data.results);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    loadData();
    window.scrollTo(0, 0);
    
    return () => mounted = false;
  }, [slug, categoryInfo]);

  if (!categoryInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl text-white font-bold mb-4">Category not found</h2>
        <button onClick={() => navigate(-1)} className="text-accent hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#212428] flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">{categoryInfo.title}</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-[32px] bg-[#212428] animate-pulse border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map(movie => (
            <div key={movie.id} className="w-full">
              <MovieCard item={movie} isTV={categoryInfo.isTV} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
