"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft, Plus, X, User, BookOpen, Phone, Calendar, Tag, Upload, FileText, Trash2, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const SUGGESTED_INTERESTS = [
  "Machine Learning", "Web Development", "Data Science", "DevOps", "Cloud Computing",
  "Competitive Programming", "Open Source", "UI/UX Design", "Cybersecurity", "Blockchain",
];

const COLORS = [
  "from-indigo-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-sky-500",
];

const COLOR_PREVIEWS = [
  "bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500",
];

function EditProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
  const isEditing = !!profileId;

  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    roll_no: "",
    college: "",
    dob: "",
    mobile_no: "",
    email: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState<{ name: string; size: number } | null>(null);
  const [resumeError, setResumeError] = useState("");

  // Load existing profile data when editing
  useEffect(() => {
    if (!isEditing || authLoading || !user) return;
    setLoadingProfile(true);
    api.profiles
      .getByUser(user.id)
      .then((profiles) => {
        const profile = profiles.find((p) => p.id === profileId);
        if (profile) {
          setForm({
            full_name: profile.full_name || "",
            roll_no: profile.roll_no || "",
            college: profile.college || "",
            dob: profile.dob || "",
            mobile_no: profile.mobile_no || "",
            email: profile.email || "",
          });
          setInterests(profile.interests || []);
        }
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoadingProfile(false));
  }, [isEditing, profileId, user, authLoading]);

  // Pre-fill email for new profiles
  useEffect(() => {
    if (!isEditing && user) {
      setForm((prev) => ({ ...prev, email: user.email || "" }));
    }
  }, [isEditing, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addInterest = (value: string) => {
    const clean = value.trim();
    if (clean && !interests.includes(clean)) setInterests([...interests, clean]);
    setInterestInput("");
  };

  const removeInterest = (value: string) => setInterests(interests.filter((i) => i !== value));

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setResumeError("Only PDF or DOCX files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size must be under 5MB.");
      return;
    }

    setResume({ name: file.name, size: file.size });
    // TODO: upload file to backend via api.resumes.upload(file)
  };

  const removeResume = () => setResume(null);

  const handleSave = async () => {
    if (!form.full_name || !user) return;
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
        id_default: false,
      };

      if (isEditing && profileId) {
        await api.profiles.save(profileId, payload);
      } else {
        await api.profiles.create(user.id, payload);
      }
      router.push("/users");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
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
        <p className="text-slate-400">Please log in to manage profiles.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 relative">
      <div className="fixed inset-0 mesh-bg pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/users")}
            className="p-2 hover:bg-white/6 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Profile" : "New Profile"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isEditing ? "Update this profile's details." : "Fill in the details to create a new profile."}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !form.full_name}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/15 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {error && (
        <div className="relative z-10 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-3 hover:text-red-300 transition-colors"><X size={14} /></button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Avatar Preview */}
        <div className="lg:col-span-1 animate-fade-in-delay-1">
          <div className="glass rounded-2xl p-6 text-center space-y-4">
            <div className={`w-24 h-24 bg-linear-to-br ${COLORS[colorIdx]} rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg`}>
              {form.full_name ? form.full_name[0].toUpperCase() : <User size={36} />}
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{form.full_name || "Name"}</p>
              <p className="text-slate-600 text-xs mt-1">{form.college || "College"}</p>
            </div>
            {/* Color Picker */}
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

            {/* Resume Upload */}
            <div className="space-y-3 pt-2 border-t border-white/6">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Resume</label>
              {resume ? (
                <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/6">
                  <div className="w-9 h-9 bg-indigo-500/15 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{resume.name}</p>
                    <p className="text-[10px] text-slate-600">{(resume.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    onClick={removeResume}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-full flex flex-col items-center gap-2 px-4 py-4 border border-dashed border-white/10 rounded-xl text-slate-400 hover:border-indigo-500/40 hover:text-indigo-400 transition-all cursor-pointer">
                  <Upload size={18} />
                  <span className="text-sm font-medium">Upload Resume</span>
                  <span className="text-[10px] text-slate-600">PDF or DOCX • Max 5MB</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              )}
              {resumeError && (
                <p className="text-xs text-red-400">{resumeError}</p>
              )}
            </div>
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
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</label>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterest(interestInput);
                  }
                }}
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
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/20"
                  >
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

export default function EditProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading...</div>}>
      <EditProfileContent />
    </Suspense>
  );
}
