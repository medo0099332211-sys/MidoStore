import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { adminLogin } from "@/lib/storage";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = adminLogin(username, password);
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-900 px-4"
      style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, #0a0a0a 70%)" }}>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown size={22} className="text-gold-500" />
            <span className="font-cormorant text-4xl gold-text tracking-widest" style={{ fontStyle: "italic" }}>MIDO</span>
            <Crown size={22} className="text-gold-500" />
          </div>
          <p className="font-cairo text-obsidian-400 text-sm tracking-widest uppercase">لوحة تحكم المسؤول</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-sm p-8 shadow-luxury">
          <h1 className="font-cairo font-bold text-xl text-cream-DEFAULT text-center mb-6">تسجيل الدخول</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">اسم المستخدم</label>
              <div className="relative">
                <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="luxury-input pr-9 text-left"
                  dir="ltr"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="luxury-input pr-9 pl-10 text-left"
                  dir="ltr"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-cream-DEFAULT transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-950 border border-red-800 rounded-sm p-3">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-red-400 text-sm font-cairo">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="font-cairo">جاري التحقق...</span>
              ) : (
                <span className="font-cairo font-bold">دخول</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-cairo text-obsidian-600 text-xs mt-6">
          Mido Store Admin Panel — محمي ومشفر
        </p>
      </div>
    </div>
  );
}
