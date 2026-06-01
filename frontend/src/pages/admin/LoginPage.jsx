import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email required";
    if (!password) e.password = "Password required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="" className="h-16 mx-auto mb-6" />
          <h1 className="font-serif text-2xl text-gold-700">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage catalog</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-xl border border-slate-200 bg-white/80 space-y-4"
        >
          <div>
            <label className="block text-sm text-gold-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg bg-slate-50 border text-slate-900 ${
                errors.email ? "border-red-500/60" : "border-slate-200"
              }`}
              placeholder="admin@aisybinaexport.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm text-gold-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg bg-slate-50 border text-slate-900 ${
                errors.password ? "border-red-500/60" : "border-slate-200"
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-900 font-semibold disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
