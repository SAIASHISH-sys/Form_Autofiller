"use client";
import { GoogleIcon } from "@/components/ui/Googleicon";
import Link from "next/link";
import { useState } from "react";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength =
    password.length === 0 ? null
    : password.length < 6 ? "weak"
    : password.length < 10 ? "medium"
    : "strong";

  const strengthColors = { weak: "bg-red-400", medium: "bg-amber-400", strong: "bg-emerald-400" };
  const strengthWidths = { weak: "w-1/3", medium: "w-2/3", strong: "w-full" };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 mesh-bg" />
      <div className="fixed top-[20%] right-[10%] w-95 h-95 bg-violet-600/7 rounded-full blur-[100px] animate-drift" />
      <div className="fixed bottom-[15%] left-[10%] w-80 h-80 bg-indigo-500/6 rounded-full blur-[100px] animate-float-slow" />
      <div className="fixed top-[50%] left-[40%] w-50 h-50 bg-fuchsia-500/4 rounded-full blur-[80px] animate-float-delayed" />

      <div className="relative z-10 w-full max-w-105 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            FormFlow<span className="text-violet-400"> AI</span>
          </span>
        </div>

        {/* Glass Card */}
        <div className="glass rounded-2xl p-8 glow-sm">
          <div className="space-y-1 mb-8">
            <h1 className="text-xl font-semibold text-white">Create your account</h1>
            <p className="text-slate-400 text-sm">Free forever · No credit card required</p>
          </div>

          <div className="space-y-5">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl glass-md font-medium text-slate-300 text-sm hover:bg-white/[0.07] transition-all cursor-pointer">
              <GoogleIcon />
              Sign up with Google
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-[11px] text-slate-500 uppercase font-medium tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl glass-input text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1 w-full bg-white/6 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthColors[passwordStrength]} ${strengthWidths[passwordStrength]}`} />
                    </div>
                    <p className={`text-xs font-medium capitalize ${passwordStrength === "weak" ? "text-red-400" : passwordStrength === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                      {passwordStrength} password
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 group shadow-lg shadow-violet-500/20"
              >
                Create Account
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <p className="text-center text-xs text-slate-500">
              By signing up you agree to our{" "}
              <a href="#" className="text-indigo-400/80 hover:text-indigo-300 transition-colors">Terms</a> and{" "}
              <a href="#" className="text-indigo-400/80 hover:text-indigo-300 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
