import React, { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Shield, CreditCard, Clock, ChevronRight, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUser, getPassword } = useAuth();
  const navigate = useNavigate();

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEdit = (field, initialValue) => {
    setEditingField(field);
    setEditValue(initialValue);
  };

  const handleSave = async () => {
    if (!editValue.trim()) return;
    try {
      await updateUser({ [editingField]: editValue });
      setEditingField(null);
      setEditValue("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ customAvatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-12 bg-transparent min-h-screen px-8">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-text-secondary">Manage your account credentials and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Card & Navigation */}
        <div className="space-y-6">
          {/* Main User Card */}
          <div className="bg-[#191B1C] rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col items-center text-center">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#212428] shadow-lg mb-6 relative group cursor-pointer flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <img 
                src={user.customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed || user.name}`} 
                alt="avatar" 
                className="w-full h-full bg-accent/20 object-cover" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                <span className="text-xs font-bold text-white">Upload Photo</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-accent text-sm font-medium mb-6">@{user.name.toLowerCase().replace(/\s/g, '')}</p>
            
            <div className="w-full h-px bg-white/10 mb-6"></div>

            <div className="w-full flex justify-between text-sm mb-3">
              <span className="text-text-secondary">Member Since</span>
              <span className="text-white font-medium">May 2026</span>
            </div>
            <div className="w-full flex justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              <span className="text-green-400 font-medium flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Premium
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#191B1C] rounded-[32px] p-4 border border-white/5 shadow-xl">
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#212428] rounded-2xl transition-colors text-left group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2a2d33] flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <CreditCard className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Subscription</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Manage billing</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={() => navigate('/watchlist')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#212428] rounded-2xl transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2a2d33] flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Clock className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Watch History</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Resume your shows</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Right Column: Credentials & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-[#191B1C] rounded-[32px] p-8 border border-white/5 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-accent" />
              Credentials & Security
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="bg-[#212428] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="flex-1 mr-4">
                    <p className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-bold">Email Address</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-text-secondary px-4 py-2 bg-black/20 rounded-full border border-white/5">
                  Verified
                </span>
              </div>

              {/* Password */}
              <div className="bg-[#212428] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="flex-1 mr-4">
                    <p className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-bold">Password</p>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-medium mt-1 tracking-[0.2em]">••••••••••••</p>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-400 px-4 py-2 bg-green-400/10 rounded-full border border-green-400/20">
                  Secured
                </span>
              </div>
              
              {/* Personal Info */}
              <div className="bg-[#212428] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="flex-1 mr-4">
                    <p className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-bold">Full Name</p>
                    {editingField === 'name' ? (
                      <input 
                        type="text" 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)} 
                        className="bg-[#161819] text-white border border-accent/50 rounded-md px-3 py-1.5 w-full focus:outline-none focus:border-accent"
                        autoFocus
                      />
                    ) : (
                      <p className="text-white font-medium">{user.name}</p>
                    )}
                  </div>
                </div>
                {editingField === 'name' ? (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingField(null)} className="text-xs font-bold text-text-secondary hover:text-white px-3 py-2 rounded-full transition-colors">Cancel</button>
                    <button onClick={handleSave} className="text-xs font-bold text-black bg-accent hover:bg-white px-4 py-2 rounded-full transition-colors">Save</button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit('name', user.name)} className="text-xs font-bold text-white bg-transparent border border-white/20 hover:bg-white/10 px-4 py-2 rounded-full transition-colors flex-shrink-0">
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#191B1C] rounded-[32px] p-8 border border-red-500/10 shadow-xl mt-8">
             <h3 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h3>
             <p className="text-sm text-text-secondary mb-6">Logging out will end your current session. You will need to enter your credentials to log back in.</p>
             
             <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-4 rounded-2xl font-bold transition-all border border-red-500/20 hover:border-red-500/40"
            >
              <LogOut className="w-5 h-5" />
              Log Out of NiteOwl
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
