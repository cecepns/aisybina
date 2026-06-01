import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import AdminTable from "../../components/admin/ui/AdminTable";
import Pagination from "../../components/admin/ui/Pagination";
import ProductFormModal from "../../components/admin/products/ProductFormModal";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { fetchCategories } from "../../services/categoryService";
import { getUploadUrl } from "../../utils/request";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchCategories({ limit: 100 });
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: debouncedSearch };
      if (categoryFilter) params.category = categoryFilter;
      const res = await fetchProducts(params);
      setProducts(res.data || []);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, categoryFilter]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter]);

  const handleDelete = (row) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Delete &quot;{row.name}&quot;?</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-500 text-slate-900 rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteProduct(row.id);
                  toast.success("Product deleted");
                  loadProducts();
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

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateProduct(editing.id, formData);
        toast.success("Product updated");
      } else {
        await createProduct(formData);
        toast.success("Product created");
      }
      setModalOpen(false);
      setEditing(null);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => {
        const thumb =
          row.images?.[0]?.image || row.image;
        return thumb ? (
          <img
            src={getUploadUrl(thumb)}
            alt=""
            className="h-10 w-10 object-cover rounded"
          />
        ) : (
          <span className="text-slate-400">—</span>
        );
      },
    },
    { key: "name", label: "Name" },
    {
      key: "category_title",
      label: "Category",
      render: (row) => row.category_title || row.category_slug,
    },
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
          <h1 className="font-serif text-2xl text-gold-700">Products</h1>
          <p className="text-slate-500 text-sm">Manage catalog products</p>
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
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.short_title}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/40 p-4">
        <AdminTable columns={columns} data={products} loading={loading} />
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        editing={editing}
        categories={categories}
        loading={submitting}
      />
    </div>
  );
}
