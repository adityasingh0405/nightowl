import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, Tv, Flame, Bookmark } from 'lucide-react';

const BottomNav = () => {
  const navLinkClass = ({ isActive }) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
      isActive ? 'text-accent' : 'text-text-secondary hover:text-white'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#000E0A]/95 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-2 pb-2">
      <NavLink to="/" end className={navLinkClass}>
        <Film className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Movies</span>
      </NavLink>
      
      <NavLink to="/tv" className={navLinkClass}>
        <Tv className="w-5 h-5" />
        <span className="text-[10px] font-semibold">TV Series</span>
      </NavLink>
      
      <NavLink to="/trending" className={navLinkClass}>
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Trending</span>
      </NavLink>
      
      <NavLink to="/watchlist" className={navLinkClass}>
        <Bookmark className="w-5 h-5" />
        <span className="text-[10px] font-semibold">My List</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
