"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Edit2, Trash2, Users, Star, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  roll_no: string;
  college: string;
  dob: string;
  mobile_no: string;
  email: string;
  interests: string[];
  id_default: boolean;
};

const COLORS = [
  "from-indigo-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-sky-500",
];

function pickColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function UsersManagement() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);

  // Load profiles from backend
  useEffect(() => {
    if (authLoading || !user) return;
    api.profiles
      .getByUser(user.id)
      .then((data) => setProfiles(data))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const confirmDelete = (id: string) => setDeleteId(id);

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await api.profiles.delete(deleteId);
      setProfiles((prev) => prev.filter((p) => p.id !== deleteId));
    } catch {
      // silently fail
    }
    setDeleteId(null);
  };

  const handleSetDefault = async (profileId: string) => {
    setSettingDefault(profileId);
    try {
      await api.profiles.setDefault(profileId);
      setProfiles((prev) =>
        prev.map((p) => ({
          ...p,
          id_default: p.id === profileId,
        }))
      );
    } catch {
      // silently fail
    }
    setSettingDefault(null);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">Please log in to view your profiles.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 relative">
      <div className="fixed inset-0 mesh-bg pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">User Profiles</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage different profiles for specific types of applications.
          </p>
        </div>
        <button
          onClick={() => router.push("/users/edit")}
          className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/15 font-semibold text-sm"
        >
          <UserPlus size={16} /> Add Profile
        </button>
      </div>

      {/* Profile List */}
      {profiles.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl relative z-10 animate-fade-in">
          <Users size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No profiles yet.</p>
          <p className="text-slate-600 text-sm mt-1">Click &quot;Add Profile&quot; to create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 relative z-10">
          {profiles.map((profile, i) => (
            <div key={profile.id} className={`animate-fade-in-delay-${Math.min(i + 1, 3)}`}>
              <div className="glass rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-linear-to-br ${pickColor(profile.id)} rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg`}
                  >
                    {profile.full_name ? profile.full_name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{profile.full_name || "Unnamed"}</h4>
                      {profile.id_default && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/20">
                          <Star size={10} className="fill-amber-400" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {profile.email}{profile.college ? ` · ${profile.college}` : ""}
                    </p>
                    {profile.interests && profile.interests.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {profile.interests.slice(0, 4).map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-medium rounded-md border border-indigo-500/15"
                          >
                            {interest}
                          </span>
                        ))}
                        {profile.interests.length > 4 && (
                          <span className="px-2 py-0.5 text-slate-500 text-[10px] font-medium">
                            +{profile.interests.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!profile.id_default && (
                    <button
                      onClick={() => handleSetDefault(profile.id)}
                      disabled={settingDefault === profile.id}
                      title="Set as default"
                      className="p-2 hover:bg-amber-500/10 rounded-xl text-slate-500 hover:text-amber-400 transition-colors"
                    >
                      {settingDefault === profile.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Star size={15} />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/users/edit?id=${profile.id}`)}
                    className="p-2 hover:bg-white/6 rounded-xl text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => confirmDelete(profile.id)}
                    className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-md rounded-2xl p-8 max-w-sm w-full mx-4 space-y-5 glow-sm animate-fade-in">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white text-lg">Delete Profile?</h3>
              <p className="text-slate-500 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-white/8 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/4 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="flex-1 py-2.5 bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
