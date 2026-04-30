import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="h-screen w-screen p-0 md:p-6 flex overflow-hidden bg-[#000E0A] md:bg-[#0d1117] relative">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]"></div>
      </div>

      {/* Main App Container */}
      <div className="flex w-full h-full bg-[#161819] md:rounded-[40px] overflow-hidden md:border border-white/5 shadow-2xl relative z-10">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-transparent transition-all duration-300 relative md:rounded-r-[40px] overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar pt-[80px] md:pt-[100px] pb-24 md:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Layout;
