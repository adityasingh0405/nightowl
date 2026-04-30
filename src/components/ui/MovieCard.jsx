import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieCard = ({ item, isTV = false }) => {
  if (!item.poster_path) return null;
  
  const imgUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  const title = isTV ? item.name : item.title;
  const overview = item.overview || "";

  return (
    <Link to={`/${isTV ? 'tv' : 'movie'}/${item.id}`} className="group relative block rounded-[32px] overflow-hidden aspect-[4/5] w-full cursor-pointer bg-bg-surface transition-transform duration-500 hover:scale-105 border border-white/5 shadow-lg">
      {/* Image */}
      <img 
        src={imgUrl} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Persistent Bottom Gradient & Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000E0A] via-[#000E0A]/40 to-transparent flex flex-col justify-end p-5">
        
        {/* Badges */}
        <div className="mb-2">
           <span className="bg-[#001F17] text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-sm">
             {isTV ? 'TV Series' : 'Movie'}
           </span>
        </div>
        
        {/* Title */}
        <h4 className="text-white font-bold text-lg mb-1 line-clamp-1 leading-tight drop-shadow-md">{title}</h4>
        
        {/* Snippet */}
        <p className="text-white/70 text-[10px] line-clamp-2 leading-snug w-[85%] pr-2">
          {overview}
        </p>
        
        {/* Floating Play Button */}
        <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
          <Play className="w-4 h-4 text-black ml-1" fill="black" />
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
