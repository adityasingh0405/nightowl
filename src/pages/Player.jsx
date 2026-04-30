import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { getMovieDetails, getTVDetails } from '../api/tmdb';

const Player = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToHistory } = useWatchHistory();
  
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const season = searchParams.get('season');
  const episode = searchParams.get('episode');

  useEffect(() => {
    // Add to watch history when player opens
    const logHistory = async () => {
      if (!id || !type) return;
      try {
        const item = type === 'movie' ? await getMovieDetails(id) : await getTVDetails(id);
        addToHistory(item);
      } catch (err) {
        console.error("Failed to log history", err);
      }
    };
    logHistory();
  }, [id, type]);

  let iframeUrl = '';
  if (type === 'movie' && id) {
    iframeUrl = `https://www.vidking.net/embed/movie/${id}?autoPlay=true&color=00E6BA`;
  } else if (type === 'tv' && id && season && episode) {
    iframeUrl = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?autoPlay=true&nextEpisode=true&color=00E6BA`;
  }

  if (!iframeUrl) {
    return (
      <div className="fixed inset-0 bg-bg-base z-[100] flex items-center justify-center">
        <p className="text-white">Invalid player URL. Please try again.</p>
        <button onClick={() => navigate(-1)} className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full">
          <X />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#000E0A]/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      
      {/* Floating Player Container */}
      <div className="relative w-full max-w-[1400px] aspect-video rounded-[40px] overflow-hidden bg-black shadow-[0_0_80px_rgba(0,230,186,0.15)] border border-white/10 flex flex-col group">
        
        {/* Header Bar overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(0,230,186,0.8)]"></div>
             <span className="text-white font-bold text-sm tracking-widest uppercase opacity-80">StreamVerse Player</span>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-accent hover:text-black text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-lg scale-90 hover:scale-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* iframe Player */}
        <div className="flex-1 w-full h-full bg-black">
          <iframe 
            src={iframeUrl} 
            className="w-full h-full border-none" 
            allowFullScreen 
            title="Video Player"
            allow="autoplay; fullscreen"
          ></iframe>
        </div>
        
      </div>
    </div>
  );
};

export default Player;
