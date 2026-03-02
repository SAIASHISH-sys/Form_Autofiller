"use client";
import { useState } from "react";
import { UserPlus, Edit2, Trash2, X, Check, Users } from "lucide-react";

type Persona = {
  id: number;
  name: string;
  role: string;
  college: string;
  tag: string;
  color: string;
};

const INITIAL_PERSONAS: Persona[] = [
  { id: 1, name: "John Doe", role: "Software Engineer", college: "IIT Delhi", tag: "Main", color: "from-indigo-500 to-blue-500" },
  { id: 2, name: "John Doe", role: "Backend Intern", college: "IIT Delhi", tag: "Intern", color: "from-violet-500 to-purple-500" },
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

const emptyForm = { name: "", role: "", college: "", tag: "" };

export default function UsersManagement() {
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [colorIdx, setColorIdx] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.name) return;
    setPersonas([...personas, { id: Date.now(), ...form, color: COLORS[colorIdx] }]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEditSave = () => {
    setPersonas(personas.map((p) => (p.id === editingId ? { ...p, ...form, color: COLORS[colorIdx] } : p)));
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (p: Persona) => {
    setEditingId(p.id);
    setForm({ name: p.name, role: p.role, college: p.college, tag: p.tag });
    setColorIdx(COLORS.indexOf(p.color));
    setShowForm(false);
  };

  const confirmDelete = (id: number) => setDeleteId(id);
  const doDelete = () => { setPersonas(personas.filter((p) => p.id !== deleteId)); setDeleteId(null); };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 relative">
      <div className="fixed inset-0 mesh-bg pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">User Personas</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage different profiles for specific types of applications.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/15 font-semibold text-sm"
        >
          <UserPlus size={16} /> Add Persona
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-md rounded-2xl p-6 space-y-4 glow-sm relative z-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">New Persona</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X size={18} />
            </button>
          </div>
          <PersonaForm form={form} onChange={handleChange} colorIdx={colorIdx} onColorChange={setColorIdx} />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/4 transition-all">Cancel</button>
            <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/15">
              <Check size={15} /> Create Persona
            </button>
          </div>
        </div>
      )}

      {/* Persona List */}
      {personas.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl relative z-10">
          <Users size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No personas yet.</p>
          <p className="text-slate-600 text-sm mt-1">Click &quot;Add Persona&quot; to create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 relative z-10">
          {personas.map((persona, i) => (
            <div key={persona.id} className={`animate-fade-in-delay-${Math.min(i + 1, 3)}`}>
              {editingId === persona.id ? (
                <div className="glass-md rounded-2xl p-6 space-y-4 glow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Edit Persona</h3>
                    <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-300"><X size={18} /></button>
                  </div>
                  <PersonaForm form={form} onChange={handleChange} colorIdx={colorIdx} onColorChange={setColorIdx} />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/4 transition-all">Cancel</button>
                    <button onClick={handleEditSave} className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/15">
                      <Check size={15} /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-linear-to-br ${persona.color} rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg`}>
                      {persona.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{persona.name}</h4>
                        <span className="px-2 py-0.5 bg-white/6 text-slate-400 text-xs font-medium rounded-full border border-white/6">{persona.tag}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{persona.role} · {persona.college}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(persona)} className="p-2 hover:bg-white/6 rounded-xl text-slate-500 hover:text-indigo-400 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => confirmDelete(persona.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
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
              <h3 className="font-semibold text-white text-lg">Delete Persona?</h3>
              <p className="text-slate-500 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-white/8 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/4 transition-all">
                Cancel
              </button>
              <button onClick={doDelete} className="flex-1 py-2.5 bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PersonaForm({
  form,
  onChange,
  colorIdx,
  onColorChange,
}: {
  form: typeof emptyForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorIdx: number;
  onColorChange: (i: number) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { name: "name", label: "Full Name", placeholder: "John Doe" },
        { name: "tag", label: "Tag / Label", placeholder: "Main, Intern, Research…" },
        { name: "role", label: "Target Role", placeholder: "Software Engineer" },
        { name: "college", label: "College", placeholder: "IIT Delhi" },
      ].map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{field.label}</label>
          <input
            name={field.name}
            value={form[field.name as keyof typeof emptyForm]}
            onChange={onChange}
            placeholder={field.placeholder}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      ))}
      <div className="sm:col-span-2 space-y-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avatar Color</label>
        <div className="flex gap-2">
          {COLOR_PREVIEWS.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => onColorChange(i)}
              className={`w-7 h-7 rounded-full ${c} transition-all ${colorIdx === i ? "ring-2 ring-offset-2 ring-offset-[#060611] ring-indigo-400 scale-110" : "hover:scale-105 opacity-60 hover:opacity-100"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
