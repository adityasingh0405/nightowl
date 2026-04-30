import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-alt/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="glass-panel p-10 rounded-2xl w-full max-w-md z-10 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.5)]">
            <Play fill="white" className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-3xl tracking-wider text-white">Stream<span className="text-accent">Verse</span></span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

        {error && <div className="bg-accent/20 border border-accent/50 text-accent px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-raised/50 border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-raised/50 border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full bg-accent hover:bg-accent-alt text-white font-medium py-3 rounded-lg transition-all glow-on-hover mt-2">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          New to StreamVerse? <Link to="/signup" className="text-accent hover:text-white transition-colors">Sign up now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
