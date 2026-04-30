import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { User, Shuffle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getTrendingMovies } from '../../api/tmdb';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        setIsScrolled(mainContent.scrollTop > 20);
      }
    };

    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) => 
    `text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300 ${
      isActive 
        ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.15)] scale-100' 
        : 'text-text-secondary hover:text-white hover:bg-white/5 scale-100'
    }`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleSurpriseMe = async () => {
    setIsShuffling(true);
    try {
      const data = await getTrendingMovies();
      if (data.results && data.results.length > 0) {
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        navigate(`/movie/${randomMovie.id}`);
      }
    } catch (err) {
      console.error("Failed to fetch surprise movie:", err);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between ${
      isScrolled ? 'bg-[#000E0A]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'
    }`}>
      
      {/* Mobile Logo */}
      <div className="md:hidden flex items-center mr-3">
        <NavLink to="/">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-[1.5] invert brightness-200 drop-shadow-[0_0_8px_rgba(0,230,186,0.4)]" />
          </div>
        </NavLink>
      </div>

      {/* Left: Search */}
      <div className="flex-1 flex items-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-[300px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors z-10" />
          <input 
            type="text" 
            placeholder="Search Movies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:bg-[#000E0A] focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-secondary shadow-inner"
          />
        </form>
      </div>

      {/* Center: Pill Navigation */}
      <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 rounded-full p-1.5 mx-auto backdrop-blur-md shadow-inner">
        <NavLink to="/" end className={navLinkClass}>Movies</NavLink>
        <NavLink to="/tv" className={navLinkClass}>TV Series</NavLink>
        <NavLink to="/trending" className={navLinkClass}>Trending</NavLink>
        <NavLink to="/watchlist" className={navLinkClass}>My List</NavLink>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <button 
          onClick={handleSurpriseMe}
          disabled={isShuffling}
          className="flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-full bg-accent text-black hover:bg-white hover:scale-105 shadow-[0_4px_15px_rgba(0,230,186,0.3)] transition-all group"
          title="Play a random trending movie!"
        >
          <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
          <span className="text-xs font-bold uppercase tracking-wider hidden lg:block">Surprise Me</span>
        </button>
        
        {user ? (
          <div 
            className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/10 hover:border-accent cursor-pointer transition-colors shadow-sm flex-shrink-0 bg-black" 
            onClick={() => navigate('/profile')}
            title="Profile Settings"
          >
            <img src={user.customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed || user.name}`} alt="avatar" className="w-full h-full object-cover" />
          </div>
        ) : (
          <NavLink to="/login" className="flex items-center gap-2 bg-white/5 border border-white/5 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 hover:border-white/10 transition-all shadow-sm">
            <User className="w-4 h-4" />
            Sign In
          </NavLink>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
