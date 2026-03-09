"use client";
import { useState, useEffect } from "react";
import { Save, Upload, X, Plus, User, BookOpen, Phone, Calendar, Tag, Pencil, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const SUGGESTED_INTERESTS = [
  "Machine Learning", "Web Development", "Data Science", "DevOps", "Cloud Computing",
  "Competitive Programming", "Open Source", "UI/UX Design", "Cybersecurity", "Blockchain",
];

const COLORS = [
  "from-indigo-500 to-violet-600",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-sky-500",
];

const COLOR_PREVIEWS = [
  "bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500",
];

export default function Profile() {
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    roll_no: "",
    college: "",
    dob: "",
    mobile_no: "",
    email: "",
  });
  const [profileId, setProfileId] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load profile from backend on mount (once user is available)
  useEffect(() => {
    if (authLoading || !user) return;

    api.profiles
      .getByUser(user.id)
      .then((profiles) => {
        // Find the default profile, or fall back to the first one
        const data = profiles.find((p) => p.id_default) || profiles[0];
        if (!data) {
          // No profiles at all — enter edit mode
          setForm((prev) => ({ ...prev, email: user.email || "" }));
          setEditing(true);
          return;
        }
        setProfileId(data.id);
        setForm({
          full_name: data.full_name || "",
          roll_no: data.roll_no || "",
          college: data.college || "",
          dob: data.dob || "",
          mobile_no: data.mobile_no || "",
          email: data.email || user.email || "",
        });
        setInterests(data.interests || []);
      })
      .catch(() => {
        // Profile doesn't exist yet — pre-fill email from auth
        setForm((prev) => ({ ...prev, email: user.email || "" }));
        setEditing(true);
      })
      .finally(() => setLoadingProfile(false));
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addInterest = (tag: string) => {
    const clean = tag.trim();
    if (clean && !interests.includes(clean)) setInterests([...interests, clean]);
    setInterestInput("");
  };

  const removeInterest = (tag: string) => setInterests(interests.filter((i) => i !== tag));

  const handleSave = async () => {
    if (!user) return;
    setError("");
    setSaving(true);
    try {
      const payload = {
        full_name: form.full_name || null,
        roll_no: form.roll_no || null,
        college: form.college || null,
        dob: form.dob || null,
        mobile_no: form.mobile_no || null,
        email: form.email || null,
        interests,
        id_default: true,
      };
      if (profileId) {
        // Update existing profile by its unique id
        await api.profiles.save(profileId, payload);
      } else {
        // Create a new profile under this user
        const created = await api.profiles.create(user.id, payload) as { id: string };
        setProfileId(created.id);
      }
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 relative">
      <div className="fixed inset-0 mesh-bg pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">This data is used to auto-fill forms via the Chrome extension.</p>
        </div>
        <div className="flex items-center gap-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border border-white/10 text-slate-300 hover:bg-white/5"
            >
              <Pencil size={15} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                saved
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : saving
                    ? "bg-indigo-600/50 text-white/50 cursor-not-allowed"
                    : "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/15 hover:from-indigo-500 hover:to-violet-500"
              }`}
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save Profile"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="relative z-10 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-3 hover:text-red-300 transition-colors"><X size={14} /></button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Avatar Card */}
        <div className="lg:col-span-1 animate-fade-in-delay-1">
          <div className="glass rounded-2xl p-6 text-center space-y-4">
            <div className={`w-24 h-24 bg-linear-to-br ${COLORS[colorIdx]} rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg shadow-indigo-500/20`}>
              {form.full_name ? form.full_name[0].toUpperCase() : <User size={36} />}
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{form.full_name || "Your Name"}</p>
              <p className="text-slate-500 text-sm">{form.college || "Your College"}</p>
            </div>

            {/* Color Picker */}
            {editing && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avatar Color</label>
                <div className="flex gap-2 justify-center">
                  {COLOR_PREVIEWS.map((c, i) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorIdx(i)}
                      className={`w-7 h-7 rounded-full ${c} transition-all ${
                        colorIdx === i
                          ? "ring-2 ring-offset-2 ring-offset-[#060611] ring-indigo-400 scale-110"
                          : "hover:scale-105 opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

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
                {editing ? (
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                ) : (
                  <p className="px-4 py-2.5 text-sm text-slate-300">{form.full_name || "—"}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mobile Number</label>
                {editing ? (
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
                ) : (
                  <p className="px-4 py-2.5 text-sm text-slate-300">{form.mobile_no || "—"}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth</label>
                {editing ? (
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
                ) : (
                  <p className="px-4 py-2.5 text-sm text-slate-300">{form.dob || "—"}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</label>
                {editing ? (
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                ) : (
                  <p className="px-4 py-2.5 text-sm text-slate-300">{form.email || "—"}</p>
                )}
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
                {editing ? (
                  <input
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    placeholder="IIT Delhi"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                ) : (
                  <p className="px-4 py-2.5 text-sm text-slate-300">{form.college || "—"}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Roll Number</label>
                {editing ? (
                  <input
                    name="roll_no"
                    value={form.roll_no}
                    onChange={handleChange}
                    placeholder="2024CS101"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                ) : (
                  <p className="px-4 py-2.5 text-sm text-slate-300">{form.roll_no || "—"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in-delay-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <Tag size={15} className="text-emerald-400" />
              Interests & Skills
            </div>

            {editing && (
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
            )}

            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/20">
                    {tag}
                    {editing && (
                      <button onClick={() => removeInterest(tag)} className="hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              !editing && <p className="text-sm text-slate-500">No interests added yet.</p>
            )}

            {editing && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
