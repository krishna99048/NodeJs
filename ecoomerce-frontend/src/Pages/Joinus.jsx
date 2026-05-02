import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, MoveRight, User, Mail, Lock, ShieldCheck } from "lucide-react";

const JoinUs = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState();
  const navigate = useNavigate();

  const userdata = { username: username, email: email, password: password };

  const submitform = async () => {
    console.log("Form Submitted...");
    console.log(userdata);

    try {
      let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, userdata);

      if (response.status === 200) {
        // localStorage logic as per your request
        localStorage.setItem("token", response.data.token);
        navigate("/login");
      }

      setusername("");
      setemail("");
      setpassword("");
    } catch (err) {
      let Err = err.response?.data?.error;
      console.log(Err);
      seterror(Err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 lg:p-10 font-sans selection:bg-amber-100">
      
      {/* Main Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        
        {/* Left Side: Brand Visual */}
        <div className="lg:col-span-5 relative hidden lg:block bg-slate-900 overflow-hidden group">
          <img 
            src="https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=800" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-2000" 
            alt="Interior" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
          
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <Sparkles className="text-white h-6 w-6" />
            </div>
            <h3 className="text-4xl font-serif font-bold leading-tight mb-4 italic text-white">Crafting Space, <br/> Defining Life.</h3>
            <p className="text-slate-300 text-sm font-light tracking-wide leading-relaxed">
              Join 5,000+ members who receive weekly curations of artisanal furniture and minimalist design trends.
            </p>
          </div>
        </div>

        {/* Right Side: Modern Form */}
        <div className="lg:col-span-7 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-8 bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 font-sans">The Circle</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Create Account</h2>
          </div>

          {/* Form - Handling Submit exactly like your logic */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              submitform();
            }} 
            className="space-y-6"
          >
            {error && (
              <div className="space-y-1">
                {error.map((val, i) => (
                  <p key={i} className="text-[10px] text-red-500 font-bold uppercase tracking-widest bg-red-50 p-2 rounded-lg border border-red-100 text-center">
                    {val.msg}
                  </p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-3 h-4 w-4 text-slate-300" />
                  <input 
                    type="text" value={username} onChange={(e) => setusername(e.target.value)}
                    className="w-full pl-7 py-3 bg-transparent border-b-2 border-slate-100 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                    placeholder="E.g. Aryan Khan" required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-3 h-4 w-4 text-slate-300" />
                  <input 
                    type="email" value={email} onChange={(e) => setemail(e.target.value)}
                    className="w-full pl-7 py-3 bg-transparent border-b-2 border-slate-100 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                    placeholder="name@email.com" required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-3 h-4 w-4 text-slate-300" />
                <input 
                  type="password" value={password} onChange={(e) => setpassword(e.target.value)}
                  className="w-full pl-7 py-3 bg-transparent border-b-2 border-slate-100 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                  placeholder="••••••••" required
                />
              </div>
            </div>

            {/* Terms (Agreement Checkbox) */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input type="checkbox" className="mt-1 accent-amber-600" required />
              <p className="text-[11px] text-slate-500 leading-tight font-medium">
                I agree to the <span className="text-amber-600 cursor-pointer hover:underline">Terms & Conditions</span>. We respect your privacy and will never share your personal information.
              </p>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-600 shadow-2xl transition-all active:scale-[0.98] group mt-4">
              Join the Circle
              <MoveRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
            <p className="text-slate-400 text-[13px] font-medium">Already a member?</p>
            <Link to="/login" className="px-6 py-2 border-2 border-slate-900 rounded-full text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JoinUs;