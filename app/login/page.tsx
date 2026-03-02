"use client";
import { GoogleIcon } from "@/components/ui/Googleicon";
import Link from "next/link";
import { useState } from "react";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 mesh-bg" />
      <div className="fixed top-[15%] left-[10%] w-105 h-105 bg-indigo-600/7 rounded-full blur-[100px] animate-drift" />
      <div className="fixed bottom-[10%] right-[15%] w-87.5 h-87.5 bg-violet-600/6 rounded-full blur-[100px] animate-float-slow" />
      <div className="fixed top-[40%] right-[30%] w-62.5 h-62.5 bg-blue-500/4 rounded-full blur-[80px] animate-float-delayed" />

      <div className="relative z-10 w-full max-w-105 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            FormFlow<span className="text-indigo-400"> AI</span>
          </span>
        </div>

        {/* Glass Card */}
        <div className="glass rounded-2xl p-8 glow-sm">
          <div className="space-y-1 mb-8">
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to your account</p>
          </div>

          <div className="space-y-5">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl glass-md font-medium text-slate-300 text-sm hover:bg-white/[0.07] transition-all cursor-pointer">
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-[11px] text-slate-500 uppercase font-medium tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-400">Password</label>
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Forgot?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
              >
                Sign In
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
