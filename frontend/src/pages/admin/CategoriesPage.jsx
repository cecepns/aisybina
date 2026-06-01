import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import AdminTable from "../../components/admin/ui/AdminTable";
import Pagination from "../../components/admin/ui/Pagination";
import CategoryFormModal from "../../components/admin/categories/CategoryFormModal";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 300);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCategories({ page, limit, search: debouncedSearch });
      setCategories(res.data || []);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = (row) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Delete category &quot;{row.title}&quot;? Products will be removed too.</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-500 text-slate-900 rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteCategory(row.id);
                  toast.success("Category deleted");
                  load();
                } catch {
                  toast.error("Delete failed");
                }
              }}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 bg-gray-600 text-slate-900 rounded text-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleSubmit = async (body) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateCategory(editing.id, body);
        toast.success("Category updated");
      } else {
        await createCategory(body);
        toast.success("Category created");
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "slug", label: "Slug" },
    { key: "title", label: "Title" },
    { key: "short_title", label: "Short Title" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            row.is_active
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-gray-500/15 text-slate-600"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
            className="p-1.5 text-gold-400 hover:bg-gold-400/10 rounded"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-gold-700">Categories</h1>
          <p className="text-slate-500 text-sm">Manage product categories</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 text-charcoal-900 font-semibold text-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/40 p-4">
        <AdminTable columns={columns} data={categories} loading={loading} />
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        editing={editing}
        loading={submitting}
      />
    </div>
  );
}
