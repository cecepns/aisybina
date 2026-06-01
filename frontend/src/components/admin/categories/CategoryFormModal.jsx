import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../ui/Modal";

const EMPTY = {
  slug: "",
  title: "",
  short_title: "",
  tagline: "",
  description: "",
  highlights: "",
  sort_order: 0,
  is_active: true,
};

export default function CategoryFormModal({ open, onClose, onSubmit, editing, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (editing) {
      const highlights = Array.isArray(editing.highlights)
        ? editing.highlights.join("\n")
        : "";
      setForm({
        slug: editing.slug || "",
        title: editing.title || "",
        short_title: editing.short_title || "",
        tagline: editing.tagline || "",
        description: editing.description || "",
        highlights,
        sort_order: editing.sort_order ?? 0,
        is_active: !!editing.is_active,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [open, editing]);

  const validate = () => {
    const e = {};
    if (!form.slug.trim()) e.slug = "Slug required";
    if (!form.title.trim()) e.title = "Title required";
    if (!form.short_title.trim()) e.short_title = "Short title required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const highlights = form.highlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({
      ...form,
      highlights,
      is_active: form.is_active ? 1 : 0,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Category" : "Add Category"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gold-700 mb-1">Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
              placeholder="muslim-koko"
            />
            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug}</p>}
          </div>
          <div>
            <label className="block text-sm text-gold-700 mb-1">Short Title *</label>
            <input
              value={form.short_title}
              onChange={(e) => setForm({ ...form, short_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
            />
            {errors.short_title && (
              <p className="text-red-400 text-xs mt-1">{errors.short_title}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gold-700 mb-1">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm text-gold-700 mb-1">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm text-gold-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gold-700 mb-1">
            Highlights (one per line)
          </label>
          <textarea
            rows={4}
            value={form.highlights}
            onChange={(e) => setForm({ ...form, highlights: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm text-gold-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            <span className="text-sm text-slate-700">Active</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-500 text-charcoal-900 font-semibold text-sm disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
