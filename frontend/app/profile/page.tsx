"use client";
import { useState } from "react";
import { Save, Upload, X, Plus, User, BookOpen, Phone, Calendar, Tag } from "lucide-react";

const SUGGESTED_INTERESTS = [
  "Machine Learning", "Web Development", "Data Science", "DevOps", "Cloud Computing",
  "Competitive Programming", "Open Source", "UI/UX Design", "Cybersecurity", "Blockchain",
];

export default function Profile() {
  const [form, setForm] = useState({
    full_name: "",
    roll_no: "",
    college: "",
    dob: "",
    mobile_no: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addInterest = (tag: string) => {
    const clean = tag.trim();
    if (clean && !interests.includes(clean)) setInterests([...interests, clean]);
    setInterestInput("");
  };

  const removeInterest = (tag: string) => setInterests(interests.filter((i) => i !== tag));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 relative">
      <div className="fixed inset-0 mesh-bg pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">This data is used to auto-fill forms via the Chrome extension.</p>
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
          {saved ? "Saved!" : "Save Profile"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Avatar Card */}
        <div className="lg:col-span-1 animate-fade-in-delay-1">
          <div className="glass rounded-2xl p-6 text-center space-y-4">
            <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg shadow-indigo-500/20">
              {form.full_name ? form.full_name[0].toUpperCase() : <User size={36} />}
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{form.full_name || "Your Name"}</p>
              <p className="text-slate-500 text-sm">{form.college || "Your College"}</p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-white/10 rounded-xl text-slate-400 hover:border-indigo-500/40 hover:text-indigo-400 transition-all text-sm font-medium">
              <Upload size={15} />
              Upload Resume
            </button>
            <p className="text-xs text-slate-600">PDF or DOCX • Max 5MB</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in-delay-1">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <User size={15} className="text-indigo-400" />
              Personal Information
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mobile Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    name="mobile_no"
                    value={form.mobile_no}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in-delay-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <BookOpen size={15} className="text-violet-400" />
              Education
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">College / University</label>
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="IIT Delhi"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Roll Number</label>
                <input
                  name="roll_no"
                  value={form.roll_no}
                  onChange={handleChange}
                  placeholder="2024CS101"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in-delay-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <Tag size={15} className="text-emerald-400" />
              Interests & Skills
            </div>

            <div className="flex gap-2">
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInterest(interestInput); }}}
                placeholder="Type a skill and press Enter…"
                className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm"
              />
              <button
                onClick={() => addInterest(interestInput)}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interests.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/20">
                    {tag}
                    <button onClick={() => removeInterest(tag)} className="hover:text-red-400 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div>
              <p className="text-xs text-slate-600 mb-2 font-medium">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.filter((s) => !interests.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => addInterest(s)}
                    className="px-3 py-1.5 bg-white/3 text-slate-400 text-xs font-medium rounded-lg border border-white/6 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
