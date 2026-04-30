import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, ChevronDown } from 'lucide-react';
import { getTVDetails, getTVCredits, getSimilarTV, getTVSeason, IMG_500, IMG_ORIGINAL } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import ContentRow from '../components/sections/ContentRow';

const TVDetail = () => {
  const { id } = useParams();
  const [tv, setTv] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailsData, creditsData] = await Promise.all([
          getTVDetails(id),
          getTVCredits(id)
        ]);
        
        if (mounted) {
          setTv(detailsData);
          setCast(creditsData.cast?.slice(0, 10) || []);
          // Find the first valid season to select (usually 1, but sometimes 0 is specials)
          const defaultSeason = detailsData.seasons?.find(s => s.season_number > 0)?.season_number || 1;
          setSelectedSeason(defaultSeason);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch TV details:", error);
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);

    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    const fetchSeason = async () => {
      if (!tv) return;
      try {
        const seasonData = await getTVSeason(id, selectedSeason);
        if (mounted) {
          setEpisodes(seasonData.episodes || []);
        }
      } catch (error) {
        console.error("Failed to fetch season details:", error);
      }
    };
    fetchSeason();
    return () => { mounted = false; };
  }, [id, selectedSeason, tv]);

  if (loading || !tv) {
    return <div className="min-h-screen bg-bg-base animate-pulse"></div>;
  }

  const inWatchlist = isInWatchlist(tv.id);

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(tv.id);
    } else {
      addToWatchlist({ ...tv, media_type: 'tv' });
    }
  };

  return (
    <div className="pb-12 bg-transparent min-h-screen md:px-8">
      {/* Hero Backdrop Box */}
      <div className="relative h-[70vh] md:h-[60vh] w-full md:rounded-[40px] overflow-hidden shadow-2xl mb-8 border-b md:border border-white/5">
        <img 
          src={tv.backdrop_path ? `${IMG_ORIGINAL}${tv.backdrop_path}` : `${IMG_500}${tv.poster_path}`} 
          alt={tv.name}
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
                src={`${IMG_500}${tv.poster_path}`} 
                alt={tv.name}
                className="w-full rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/10"
              />
            </div>

            {/* Details */}
            <div className="flex-1 w-full">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 drop-shadow-xl line-clamp-2 md:line-clamp-none">{tv.name}</h1>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-text-secondary mb-4 md:mb-6 font-medium">
                <span className="flex items-center gap-1 text-gold"><span className="text-[12px]">⭐</span> {tv.vote_average?.toFixed(1)}</span>
                <span>{tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : ''}</span>
                <span>{tv.number_of_seasons} Seasons</span>
                <div className="flex gap-2">
                  {tv.genres?.map(g => (
                    <span key={g.id} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-white/80 text-[11px] md:text-base leading-relaxed max-w-3xl mb-6 md:mb-8 line-clamp-3 md:line-clamp-4">
                {tv.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-10">
                <Link 
                  to={`/player?type=tv&id=${tv.id}&season=${selectedSeason}&episode=1`} 
                  className="flex-1 sm:flex-none justify-center bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
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
                <div className="mb-12">
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

      {/* Seasons & Episodes section below hero */}
      <div className="px-8 mt-12 mb-16">
        {tv.seasons && tv.seasons.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Episodes</h3>
              <div className="relative">
                <select 
                  className="appearance-none bg-[#212428] border border-white/10 text-white py-2 pl-6 pr-12 rounded-full focus:outline-none focus:border-accent cursor-pointer font-medium"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                >
                  {tv.seasons.filter(s => s.season_number > 0).map(season => (
                    <option key={season.id} value={season.season_number}>
                      Season {season.season_number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {episodes.map(episode => (
                <Link 
                  to={`/player?type=tv&id=${tv.id}&season=${selectedSeason}&episode=${episode.episode_number}`}
                  key={episode.id} 
                  className="flex gap-4 bg-[#212428]/80 hover:bg-[#212428] p-4 rounded-3xl border border-white/5 transition-all group cursor-pointer shadow-lg hover:-translate-y-1"
                >
                  <div className="w-48 h-28 rounded-2xl overflow-hidden flex-shrink-0 relative border border-white/5">
                    {episode.still_path ? (
                      <img src={`${IMG_500}${episode.still_path}`} alt={episode.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-bg-base flex items-center justify-center text-xs text-text-muted">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white text-base font-bold line-clamp-1 group-hover:text-accent transition-colors">{episode.episode_number}. {episode.name}</h4>
                      <span className="text-[10px] font-medium text-text-secondary flex-shrink-0 ml-2 bg-white/5 px-2 py-1 rounded-md">{episode.runtime || '?'} min</span>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">{episode.overview}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar TV Shows */}
      <div className="mt-8">
        <ContentRow title="Similar TV Shows" fetchUrl={() => getSimilarTV(id)} isTV={true} />
      </div>

    </div>
  );
};

export default TVDetail;
