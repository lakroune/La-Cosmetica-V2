import axios from "axios";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitLesInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/login", { email, password });
      if (response.status === 200) {
        toast.success("Connexion réussie !");
        Cookies.set("token", response.data.access_token);
        navigate("/");
      }
    } catch (error) {
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitLesInfo();
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />

        <div className="px-8 py-10">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4">
              <span className="text-xl">🌿</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">La Cosmetica</h1>
            <p className="text-sm text-gray-400 mt-1">Connectez-vous à votre compte</p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                <Mail size={16} className="text-rose-300 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="vous@exemple.com"
                  className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Mot de passe
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                <Lock size={16} className="text-rose-300 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={submitLesInfo}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-rose-400 hover:bg-rose-500 active:scale-95 text-white text-sm font-medium rounded-lg py-2.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Se connecter <ArrowRight size={15} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-rose-400 hover:text-rose-500 font-medium transition-colors">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;