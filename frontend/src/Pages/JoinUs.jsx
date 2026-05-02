import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function JoinUs() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState([]);

  const navigate = useNavigate();

  const userdata = { username: username, email: email, password: password };

  const submitForm = async () => {
    console.log("Form Submitted !");
    
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register`, 
        userdata
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        // Successful registration takes you to login
        navigate('/login');
      }

      // Reset fields on success
      setusername("");
      setemail("");
      setpassword("");
      seterror("");

    } catch (err) {
      const errorData = err.response?.data;
      console.log("Error details:", errorData);

      let messages = [];
      if (Array.isArray(errorData?.error)) {
        messages = errorData.error;
      } else if (typeof errorData?.error === "string") {
        messages = [{ msg: errorData.error }];
      } else if (typeof errorData?.message === "string") {
        messages = [{ msg: errorData.message }];
      } else {
        messages = [{ msg: "Server connection failed. Please try again later." }];
      }

      seterror(messages);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/3 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-500 hover:border-white/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-indigo-500/20 mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Join Us</h2>
          <p className="text-indigo-200/60 mt-2">Create your account to get started</p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }} 
          className="space-y-4"
        >
          {/* Error Display Section */}
          {error && (
            <div className="animate-in fade-in zoom-in duration-300">
              {error.map((val, index) => (
                <p 
                  key={index} 
                  className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 w-full text-red-200 mb-2 text-center text-sm font-medium"
                >
                  {val.msg}
                </p>
              ))}
            </div>
          )}

          {/* Full Name Input */}
          <div>
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Full Name</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="name@company.com"
              className="w-full mt-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 mt-4"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-indigo-200/50 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:text-indigo-400 font-medium underline underline-offset-4 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}