"use client";
import { useState } from "react";
import { Bell, Shield, Globe, Palette, Save, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    extensionSync: true,
    autoFillEnabled: true,
    theme: "dark",
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      title: "Notifications",
      icon: Bell,
      iconColor: "text-blue-400",
      items: [
        {
          label: "Email notifications",
          desc: "Receive updates about form activity and account changes",
          key: "emailNotifications" as const,
        },
      ],
    },
    {
      title: "Extension",
      icon: Globe,
      iconColor: "text-emerald-400",
      items: [
        {
          label: "Auto-sync data",
          desc: "Automatically sync your profile data with the Chrome extension",
          key: "extensionSync" as const,
        },
        {
          label: "Enable auto-fill",
          desc: "Allow the extension to auto-fill forms on supported websites",
          key: "autoFillEnabled" as const,
        },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative">
      <div className="fixed inset-0 mesh-bg pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your preferences and account configuration.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/15 hover:from-indigo-500 hover:to-violet-500"
          }`}
        >
          <Save size={15} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Setting Sections */}
      {sections.map((section, si) => (
        <div key={section.title} className={`glass rounded-2xl overflow-hidden relative z-10 animate-fade-in-delay-${Math.min(si + 1, 3)}`}>
          <div className="px-6 py-4 border-b border-white/4 flex items-center gap-3">
            <section.icon size={16} className={section.iconColor} />
            <h2 className="font-semibold text-white text-sm">{section.title}</h2>
          </div>
          <div className="divide-y divide-white/4">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                    settings[item.key] ? "bg-indigo-600" : "bg-white/8"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      settings[item.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Appearance */}
      <div className="glass rounded-2xl overflow-hidden relative z-10 animate-fade-in-delay-2">
        <div className="px-6 py-4 border-b border-white/4 flex items-center gap-3">
          <Palette size={16} className="text-violet-400" />
          <h2 className="font-semibold text-white text-sm">Appearance</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm font-medium text-slate-200 mb-3">Theme</p>
          <div className="flex gap-3">
            {[
              { value: "light", label: "Light", emoji: "☀️" },
              { value: "dark", label: "Dark", emoji: "🌙" },
              { value: "system", label: "System", emoji: "💻" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSettings((s) => ({ ...s, theme: opt.value }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                  settings.theme === opt.value
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                    : "bg-white/2 border-white/6 text-slate-500 hover:border-white/10 hover:text-slate-300"
                }`}
              >
                <span>{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl overflow-hidden border-red-500/10 relative z-10 animate-fade-in-delay-3">
        <div className="px-6 py-4 border-b border-red-500/10 flex items-center gap-3">
          <Shield size={16} className="text-red-400" />
          <h2 className="font-semibold text-red-400 text-sm">Danger Zone</h2>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-200">Delete account</p>
            <p className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all associated data</p>
          </div>
          <button className="flex items-center gap-1 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/20 border border-red-500/15 transition-colors">
            Delete
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
