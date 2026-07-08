// src/Component/Auth/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/hero.png";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={location.state?.from || "/"} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left brand panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-[#154895] via-slate-900 to-slate-900 opacity-90" />
        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Sandesh Innovations" className="w-12 h-12 object-contain" />
          <span className="text-lg font-bold">Sandesh Innovations</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
            Manage your web &amp; AI business, all in one place.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Track blogs, client projects, and revenue for Sandesh Innovations from a single admin dashboard.
          </p>
        </div>
        <p className="relative z-10 text-xs text-slate-400">© 2026 Sandesh Innovations. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <img src={logo} alt="Sandesh Innovations" className="w-12 h-12 object-contain" />
            <span className="text-lg font-bold text-slate-800">Sandesh Innovations</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-8">Sign in to access the admin panel</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sandeshinnovations.com" autoComplete="username"
                  className="w-full pl-10 pr-3 py-3 text-sm border border-slate-200 rounded-xl outline-none
                    focus:border-[#154895] focus:ring-2 focus:ring-[#154895]/10 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl outline-none
                    focus:border-[#154895] focus:ring-2 focus:ring-[#154895]/10 transition-all"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#154895] text-white text-sm font-semibold
                rounded-xl hover:bg-[#1240a0] active:scale-95 disabled:opacity-60 transition-all shadow-sm shadow-[#154895]/25">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}