import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MovieDetail from './pages/MovieDetail'
import TVDetail from './pages/TVDetail'
import Search from './pages/Search'
import Watchlist from './pages/Watchlist'
import Player from './pages/Player'
import Category from './pages/Category'
import Profile from './pages/Profile'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/player" element={<Player />} />
        
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home category="movies" />} />
          <Route path="/tv" element={<Home category="tv" />} />
          <Route path="/trending" element={<Home category="trending" />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="tv/:id" element={<TVDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Protected Routes */}
          <Route 
            path="watchlist" 
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
