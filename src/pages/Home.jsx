import React from 'react';
import HeroBanner from '../components/sections/HeroBanner';
import ContentRow from '../components/sections/ContentRow';
import { 
  getTrendingMovies, 
  getTrendingTV, 
  getPopularMovies, 
  getTopRatedMovies,
  getPopularTV,
  getNowPlaying 
} from '../api/tmdb';

const Home = ({ category = 'movies' }) => {
  return (
    <div className="pb-20">
      {/* Dynamic Hero Banner */}
      <HeroBanner fetchUrl={category === 'tv' ? getTrendingTV : getTrendingMovies} />

      {/* Rows specific to categories */}
      {category === 'movies' && (
        <>
          <ContentRow title="Trending Movies" fetchUrl={getTrendingMovies} />
          <ContentRow title="Now Playing" fetchUrl={getNowPlaying} />
          <ContentRow title="Top Rated" fetchUrl={getTopRatedMovies} />
          <ContentRow title="Popular Movies" fetchUrl={getPopularMovies} />
        </>
      )}

      {category === 'tv' && (
        <>
          <ContentRow title="Trending TV Shows" fetchUrl={getTrendingTV} isTV={true} />
          <ContentRow title="Popular TV Shows" fetchUrl={getPopularTV} isTV={true} />
        </>
      )}

      {category === 'trending' && (
        <>
          <ContentRow title="Trending Movies" fetchUrl={getTrendingMovies} />
          <ContentRow title="Trending TV Shows" fetchUrl={getTrendingTV} isTV={true} />
        </>
      )}
    </div>
  );
};

export default Home;
