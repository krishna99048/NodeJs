import React from "react";
import { LogOut, Bell, Settings, UserCircle } from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Get initials for the avatar
  const initials = user?.username?.split(" ").map(n => n[0]).join("").toUpperCase() || "A";

  return (
    <nav className="sticky top-0 z-50 px-8 py-4 flex justify-between items-center bg-[#FAF9F6]/80 backdrop-blur-xl border-b border-slate-100">
      
      {/* Left Side: Contextual Greeting */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            System Live
          </span>
        </div>
        <h2 className="text-sm font-serif font-bold text-slate-900 italic">
          Hello, {user?.username || "Architect"}
        </h2>
      </div>

      {/* Right Side: Identity & Actions */}
      <div className="flex items-center gap-6">
        
        {/* Utility Icons */}
        <div className="hidden md:flex items-center gap-4 text-slate-400 border-r border-slate-200 pr-6">
          <button className="hover:text-amber-600 transition-colors">
            <Bell size={18} strokeWidth={1.5} />
          </button>
          <button className="hover:text-amber-600 transition-colors">
            <Settings size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Profile Group */}
        <div className="flex items-center gap-4 group">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter">
              {user?.username}
            </p>
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-1">
              {user?.role || "Administrator"}
            </p>
          </div>

          {/* Identity Avatar */}
          <div className="relative cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-serif font-bold transition-all group-hover:border-amber-500 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95 group"
        >
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;