import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DataContext } from "../Context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Holds error messages
  const {setCenterData} = useContext(DataContext)
  
  const navigate = useNavigate();

  const submitForm = async () => {
    console.log("Form submitted..!");
    const userdata = { email: email, password: password };

    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        userdata
      );

      if (response.status === 200) {
        const data = response.data;
        // Ensure you use the correct token key from your backend response
        localStorage.setItem("token", data.token); 
        setCenterData(data.checkUser)

        navigate("/profile");
        setError(""); // Clear errors on success
      }

      setEmail("");
      setPassword("");
    } catch (e) {
      // 1. Capture the error from backend
      const backendError = e.response?.data?.error || e.response?.data?.message || "Something went wrong";
      
      // 2. Format as array to keep the .map() consistent with JoinUs
      if (typeof backendError === "string") {
        setError([{ msg: backendError }]);
      } else {
        setError(backendError);
      }
      
      console.log("Login Error:", backendError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/3 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-500 hover:border-white/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-indigo-500/20 mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome
          </h2>
          <p className="text-indigo-200/60 mt-2">Sign in to continue your journey</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="space-y-4"
        >
          {/* Error Display Section (Matches JoinUs Styling) */}
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

          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              name="email"
              value={email}
              className="w-full mt-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              name="password"
              value={password}
              className="w-full mt-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 mt-4"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-indigo-200/50 text-sm">
          New here?{" "}
          <Link
            to="/joinus"
            className="text-white hover:text-indigo-400 font-medium underline underline-offset-4 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}