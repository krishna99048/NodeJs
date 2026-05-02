import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { dataContext } from '../content/dataContext';
import { User, Mail, MoveLeft, Save, Sparkles } from "lucide-react";

const EditProfile = () => {
    const [error, seterror] = useState("");
    const [formdata, setformdata] = useState({ email: "", username: "" });
    const { centerdata } = useContext(dataContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (centerdata) {
            setformdata({ email: centerdata.email, username: centerdata.username })
        }
    }, [centerdata]);

    const handleChange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value })
    }

    const submitform = async (e) => {
        if(e) e.preventDefault(); // Standard way to handle form submit
        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/user/update`, formdata, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            navigate("/profile");
        } catch (error) {
            console.log(error.response);
            seterror(error.response?.data?.message || "Update failed");
        }
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 lg:p-10 font-sans selection:bg-amber-100">
            
            {/* Main Editorial Container */}
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
                
                {/* Left Side: Visual Narrative (5 Columns) */}
                <div className="lg:col-span-5 relative hidden lg:block bg-slate-900 overflow-hidden group">
                    <img 
                        src="https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-2000" 
                        alt="Design aesthetic" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/40">
                            <Sparkles className="text-white h-6 w-6" />
                        </div>
                        <h3 className="text-3xl font-serif font-bold leading-tight mb-4 italic">Refine Your <br/> Presence.</h3>
                        <p className="text-slate-400 text-xs font-light tracking-widest leading-relaxed uppercase">
                            Keep your digital identity as sharp as your design sense.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form Content (7 Columns) */}
                <div className="lg:col-span-7 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
                    
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-0.5 w-8 bg-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Preferences</span>
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Edit Identity</h2>
                    </div>

                    <form onSubmit={submitform} className="space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center">{error}</p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="group space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-amber-600 transition-colors">
                                Public Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-0 top-3 h-4 w-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={formdata.username} 
                                    onChange={handleChange}
                                    className="w-full pl-7 py-3 bg-transparent border-b-2 border-slate-100 focus:border-amber-500 outline-none transition-all text-sm font-medium text-slate-900"
                                    placeholder="Username" 
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="group space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-amber-600 transition-colors">
                                Verified Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-0 top-3 h-4 w-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formdata.email} 
                                    onChange={handleChange}
                                    className="w-full pl-7 py-3 bg-transparent border-b-2 border-slate-100 focus:border-amber-500 outline-none transition-all text-sm font-medium text-slate-900"
                                    placeholder="Email Address" 
                                    required
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 space-y-4">
                            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-600 shadow-2xl transition-all active:scale-[0.98] group">
                                <Save className="h-4 w-4" />
                                Update Credentials
                            </button>
                            
                            <Link 
                                to="/profile" 
                                className="w-full border-2 border-slate-100 text-slate-400 py-4.5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:border-slate-900 hover:text-slate-900 transition-all"
                            >
                                <MoveLeft className="h-4 w-4" />
                                Back to Profile
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfile;
