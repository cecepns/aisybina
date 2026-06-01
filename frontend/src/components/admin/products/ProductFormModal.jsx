import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import Modal from "../ui/Modal";
import RichTextEditor from "../ui/RichTextEditor";
import { fetchProduct } from "../../../services/productService";
import { getUploadUrl } from "../../../utils/request";
import { stripHtml } from "../../../utils/html";

const EMPTY = {
  category_id: "",
  name: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

const emptySeries = () => ({ id: null, name: "", description: "", sort_order: 0, is_active: true });

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  editing,
  categories,
  loading,
}) {
  const [form, setForm] = useState(EMPTY);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [series, setSeries] = useState([emptySeries()]);
  const [errors, setErrors] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (!open) return;

    const resetNew = () => {
      setNewFiles([]);
      setNewPreviews([]);
      setRemoveImageIds([]);
    };

    if (editing?.id) {
      setLoadingDetail(true);
      fetchProduct(editing.id)
        .then((res) => {
          const p = res.data;
          setForm({
            category_id: String(p.category_id),
            name: p.name || "",
            description: p.description || "",
            sort_order: p.sort_order ?? 0,
            is_active: !!p.is_active,
          });
          setExistingImages(
            (p.images || []).map((img) => ({
              id: img.id,
              url: getUploadUrl(img.image),
            }))
          );
          setSeries(
            p.series?.length
              ? p.series.map((s) => ({
                  id: s.id,
                  name: s.name || "",
                  description: s.description || "",
                  sort_order: s.sort_order ?? 0,
                  is_active: s.is_active !== false && s.is_active !== 0,
                }))
              : [emptySeries()]
          );
          resetNew();
        })
        .catch(() => {
          setForm({
            category_id: String(editing.category_id),
            name: editing.name || "",
            description: editing.description || "",
            sort_order: editing.sort_order ?? 0,
            is_active: !!editing.is_active,
          });
          setExistingImages([]);
          setSeries([emptySeries()]);
          resetNew();
        })
        .finally(() => setLoadingDetail(false));
    } else {
      setForm({
        ...EMPTY,
        category_id: categories[0]?.id ? String(categories[0].id) : "",
      });
      setExistingImages([]);
      setSeries([emptySeries()]);
      resetNew();
      setLoadingDetail(false);
    }
    setErrors({});
  }, [open, editing, categories]);

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeExistingImage = (id) => {
    setRemoveImageIds((prev) => [...prev, id]);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNewImage = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSeries = () => setSeries((prev) => [...prev, emptySeries()]);

  const updateSeries = (index, field, value) => {
    setSeries((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const removeSeries = (index) => {
    setSeries((prev) => (prev.length <= 1 ? [emptySeries()] : prev.filter((_, i) => i !== index)));
  };

  const validate = () => {
    const e = {};
    if (!form.category_id) e.category_id = "Category required";
    if (!form.name.trim()) e.name = "Name required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("category_id", form.category_id);
    fd.append("name", form.name);
    fd.append("description", form.description === "<p><br></p>" ? "" : form.description);
    fd.append("sort_order", form.sort_order);
    fd.append("is_active", form.is_active ? "1" : "0");

    newFiles.forEach((file) => fd.append("images", file));
    fd.append("remove_image_ids", JSON.stringify(removeImageIds));

    const seriesPayload = series
      .filter((s) => s.name.trim())
      .map((s, i) => ({
        id: s.id || undefined,
        name: s.name.trim(),
        description: s.description || "",
        sort_order: i,
        is_active: s.is_active ? 1 : 0,
      }));
    fd.append("series", JSON.stringify(seriesPayload));

    onSubmit(fd);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Product" : "Add Product"}
      size="xl"
    >
      {loadingDetail ? (
        <div className="flex justify-center py-16">
          <Loader2 className="text-gold-500 animate-spin" size={32} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gold-700 mb-1">Category *</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-400 text-xs mt-1">{errors.category_id}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gold-700 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gold-700 mb-1">Description</label>
            <RichTextEditor
              value={form.description}
              onChange={(description) => setForm({ ...form, description })}
            />
            {form.description && stripHtml(form.description) && (
              <p className="text-xs text-slate-400 mt-1">Shown on product detail page.</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gold-700 mb-2">Product images (multiple)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt="" className="h-20 w-20 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {newPreviews.map((url, i) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg border border-gold-300" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImages}
              className="text-sm text-slate-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gold-700">Product series / variants</label>
              <button
                type="button"
                onClick={addSeries}
                className="inline-flex items-center gap-1 text-xs text-gold-600 font-semibold"
              >
                <Plus size={14} /> Add series
              </button>
            </div>
            <div className="space-y-3">
              {series.map((s, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2"
                >
                  <div className="flex gap-2">
                    <input
                      placeholder="Series name (e.g. Size S, Red Series)"
                      value={s.name}
                      onChange={(e) => updateSeries(index, "name", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSeries(index)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    placeholder="Short description (optional)"
                    value={s.description}
                    onChange={(e) => updateSeries(index, "description", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={s.is_active}
                      onChange={(e) => updateSeries(index, "is_active", e.target.checked)}
                    />
                    Active
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gold-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <span className="text-sm text-slate-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
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
      )}
    </Modal>
  );
}
