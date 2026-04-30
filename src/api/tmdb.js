const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchFromTMDB = async (endpoint) => {
  const separator = endpoint.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`);
  if (!res.ok) throw new Error("TMDB API Error");
  return res.json();
};

// 🔥 Home Data
export const getTrendingMovies = () => fetchFromTMDB("/trending/movie/week");
export const getTrendingTV = () => fetchFromTMDB("/trending/tv/week");
export const getPopularMovies = () => fetchFromTMDB("/movie/popular");
export const getTopRatedMovies = () => fetchFromTMDB("/movie/top_rated");
export const getNowPlaying = () => fetchFromTMDB("/movie/now_playing");
export const getPopularTV = () => fetchFromTMDB("/tv/popular");
export const getUpcomingMovies = () => fetchFromTMDB("/movie/upcoming");
export const getAnimationMovies = () => fetchFromTMDB("/discover/movie?with_genres=16");

// 🎭 Genres
export const getMovieGenres = () => fetchFromTMDB("/genre/movie/list");
export const getTVGenres = () => fetchFromTMDB("/genre/tv/list");

// 🔍 Search
export const searchMulti = (query) => fetchFromTMDB(`/search/multi?query=${query}`);

// 🎬 Movie
export const getMovieDetails = (id) => fetchFromTMDB(`/movie/${id}`);
export const getMovieCredits = (id) => fetchFromTMDB(`/movie/${id}/credits`);
export const getSimilarMovies = (id) => fetchFromTMDB(`/movie/${id}/similar`);

// 📺 TV
export const getTVDetails = (id) => fetchFromTMDB(`/tv/${id}`);
export const getTVSeason = (id, season) => fetchFromTMDB(`/tv/${id}/season/${season}`);
export const getTVCredits = (id) => fetchFromTMDB(`/tv/${id}/credits`);
export const getSimilarTV = (id) => fetchFromTMDB(`/tv/${id}/similar`);

// 🖼️ Image Helpers
export const IMG_500 = "https://image.tmdb.org/t/p/w500";
export const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
