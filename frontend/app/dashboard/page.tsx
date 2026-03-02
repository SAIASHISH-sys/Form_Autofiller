import {
  FileText, MousePointerClick, Users, UserCircle,
  ArrowRight, Upload, Sparkles, TrendingUp,
  Clock, CheckCircle2, Zap, ChevronRight
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Personas", value: "2", change: "+1 this week", icon: Users, accent: "from-indigo-500 to-blue-500", glow: "shadow-indigo-500/10" },
  { label: "Resumes", value: "1", change: "Up to date", icon: FileText, accent: "from-violet-500 to-purple-500", glow: "shadow-violet-500/10" },
  { label: "Forms Filled", value: "14", change: "+3 today", icon: MousePointerClick, accent: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/10" },
  { label: "Time Saved", value: "~2h", change: "This month", icon: TrendingUp, accent: "from-amber-500 to-orange-500", glow: "shadow-amber-500/10" },
];

const quickActions = [
  { label: "Edit Profile", desc: "Update personal details", href: "/profile", icon: UserCircle, accent: "text-blue-400" },
  { label: "Manage Personas", desc: "Add or switch profiles", href: "/users", icon: Users, accent: "text-violet-400" },
  { label: "Upload Resume", desc: "Improve AI accuracy", href: "/profile", icon: Upload, accent: "text-emerald-400" },
];

const recentActivity = [
  { action: "Filled Google Form", detail: "GDSC Registration Form", time: "2 min ago", icon: CheckCircle2, color: "text-emerald-400" },
  { action: "Resume updated", detail: "resume_v3.pdf uploaded", time: "1 hour ago", icon: FileText, color: "text-blue-400" },
  { action: "New persona created", detail: "Intern profile added", time: "Yesterday", icon: Users, color: "text-violet-400" },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative">
      <div className="fixed inset-0 mesh-bg pointer-events-none" />

      {/* Hero welcome */}
      <div className="relative overflow-hidden rounded-2xl glass glow-md p-8 sm:p-10 animate-fade-in">
        {/* Inner glow orbs */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/8 rounded-full blur-[60px] animate-float" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-violet-500/6 rounded-full blur-[50px] animate-float-slow" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-medium">Good morning 👋</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 backdrop-blur-sm rounded-full text-xs font-medium border border-white/6 text-slate-300">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-soft-pulse" />
                Extension active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome back, John</h1>
            <p className="text-slate-400 text-sm max-w-md">
              Your autofill profiles are synced and ready. Visit any Google Form and let FormFlow handle the rest.
            </p>
          </div>
          <button className="shrink-0 px-5 py-2.5 bg-white/6 hover:bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl transition-all text-sm border border-white/8 flex items-center gap-2 group">
            <Zap size={15} className="text-indigo-400" />
            Sync Now
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-delay-1 relative z-10">
        {stats.map((stat) => (
          <div key={stat.label} className={`glass rounded-2xl p-5 hover:bg-white/5 transition-all group shadow-lg ${stat.glow}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${stat.accent} flex items-center justify-center shadow-lg`}>
                <stat.icon size={16} className="text-white" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 relative z-10">
        {/* Quick Actions */}
        <div className="lg:col-span-3 space-y-4 animate-fade-in-delay-2">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Zap size={12} className="text-indigo-400" />
            Quick Actions
          </h2>
          <div className="grid gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-4 glass rounded-xl px-5 py-4 hover:bg-white/5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center border border-white/6 group-hover:border-white/10 transition-colors">
                  <action.icon size={18} className={`${action.accent} transition-colors`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm">{action.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4 animate-fade-in-delay-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Clock size={12} className="text-slate-500" />
            Recent Activity
          </h2>
          <div className="glass rounded-xl divide-y divide-white/4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-white/2 transition-colors">
                <div className="mt-0.5">
                  <item.icon size={15} className={item.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{item.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.detail}</p>
                </div>
                <span className="text-[11px] text-slate-600 shrink-0 mt-0.5">{item.time}</span>
              </div>
            ))}
          </div>
          <Link
            href="#"
            className="flex items-center justify-center gap-1 text-xs text-indigo-400/80 font-medium hover:text-indigo-300 transition-colors py-1"
          >
            View all activity
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* Extension CTA */}
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 animate-fade-in-delay-3 relative z-10">
        <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-semibold text-white">Chrome Extension is Active</h4>
          <p className="text-slate-500 text-sm mt-0.5">
            Visit any Google Form and click the FormFlow icon — your data fills in automatically.
          </p>
        </div>
        <button className="shrink-0 px-5 py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all text-sm shadow-lg shadow-indigo-500/15">
          Open Extension
        </button>
      </div>
    </div>
  );
}
