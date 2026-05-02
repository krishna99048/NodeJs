import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { dataContext } from "../content/dataContext";
import { MoveRight, Mail, Lock, Fingerprint } from "lucide-react";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const { setCenterData } = useContext(dataContext);
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, {
        email,
        password,
      });

      if (res.status === 200) {
        const data = res.data;

        // 1. Save Token
        localStorage.setItem("token", data.token);

        // 2. Save User Object (Standard for session persistence)
        localStorage.setItem("user", JSON.stringify(data.checkUser));

        // 3. Update Context
        setCenterData(data.checkUser);

        // 4. Admin vs User Redirection Logic
        if (data.checkUser.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      }
    } catch (e) {
      // Backend error format handle karna (Array ya string)
      const errorMsg = e.response?.data?.error;
      seterror(Array.isArray(errorMsg) ? errorMsg[0].msg : "Authentication Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 lg:p-10 font-sans selection:bg-emerald-100">
      
      {/* Main Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        
        {/* Left Side: Immersive Brand Visual */}
        <div className="lg:col-span-5 relative hidden lg:block bg-slate-900 overflow-hidden group">
          <img 
            src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800" 
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-2000" 
            alt="Astra Luxury" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40">
              <Fingerprint className="text-white h-6 w-6" />
            </div>
            <h3 className="text-4xl font-serif font-bold leading-tight mb-4 italic">Welcome <br/> to the Studio.</h3>
            <p className="text-slate-300 text-sm font-light tracking-wide leading-relaxed">
              Unlock your curated dashboard and continue personalizing your dream spaces with Astra's premium collection.
            </p>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="lg:col-span-7 p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-white">
          
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-8 bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Secure Access</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-slate-400 text-sm mt-3">Please enter your credentials to manage your account.</p>
          </div>

          <form onSubmit={submitForm} className="space-y-8">
            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-10">
              {/* Email Field */}
              <div className="group relative">
                <label className="absolute left-0 -top-6 text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-amber-600 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-0 top-3 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setemail(e.target.value)}
                    className="w-full pl-7 py-3 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-medium placeholder-slate-200"
                    placeholder="name@email.com" 
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group relative">
                <label className="absolute left-0 -top-6 text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-amber-600 transition-colors">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-3 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setpassword(e.target.value)}
                    className="w-full pl-7 py-3 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-medium placeholder-slate-200"
                    placeholder="••••••••" 
                    required
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                Remember me
              </label>
              <span className="cursor-pointer hover:text-emerald-600 transition-colors">Forgot Password?</span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-emerald-600 shadow-2xl transition-all active:scale-[0.98] group">
              Access Account
              <MoveRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
            <p className="text-slate-400 text-[13px] font-medium">New to Astra?</p>
            <Link to="/joinus" className="px-6 py-2 border-2 border-slate-900 rounded-full text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
              Join the Circle
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
