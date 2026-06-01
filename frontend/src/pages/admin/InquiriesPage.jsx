import { useState, useEffect, useCallback } from "react";
import { Search, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import AdminTable from "../../components/admin/ui/AdminTable";
import Pagination from "../../components/admin/ui/Pagination";
import Modal from "../../components/admin/ui/Modal";
import {
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../../services/inquiryService";

const STATUS_OPTIONS = ["new", "read", "replied"];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 300);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: debouncedSearch };
      if (statusFilter) params.filter = statusFilter;
      const res = await fetchInquiries(params);
      setInquiries(res.data || []);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success("Status updated");
      load();
      if (viewing?.id === id) setViewing({ ...viewing, status });
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = (row) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Delete inquiry from {row.name}?</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-500 text-slate-900 rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteInquiry(row.id);
                  toast.success("Deleted");
                  setViewing(null);
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

  const statusBadge = (status) => {
    const colors = {
      new: "bg-blue-500/15 text-blue-400",
      read: "bg-amber-500/15 text-amber-400",
      replied: "bg-emerald-500/15 text-emerald-400",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "product_interest",
      label: "Interest",
      render: (row) => row.product_interest || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="text-xs px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 capitalize"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewing(row)}
            className="p-1.5 text-gold-400 hover:bg-gold-400/10 rounded"
          >
            <Eye size={16} />
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
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gold-700">Inquiries</h1>
        <p className="text-slate-500 text-sm">Contact form submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm"
        >
          <option value="">All status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/40 p-4">
        <AdminTable columns={columns} data={inquiries} loading={loading} />
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Inquiry Detail">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status</span>
              {statusBadge(viewing.status)}
            </div>
            <div>
              <span className="text-slate-500 block">Name</span>
              <p className="text-slate-900">{viewing.name}</p>
            </div>
            <div>
              <span className="text-slate-500 block">Email</span>
              <a href={`mailto:${viewing.email}`} className="text-gold-400">
                {viewing.email}
              </a>
            </div>
            {viewing.company && (
              <div>
                <span className="text-slate-500 block">Company</span>
                <p className="text-slate-900">{viewing.company}</p>
              </div>
            )}
            {viewing.product_interest && (
              <div>
                <span className="text-slate-500 block">Product Interest</span>
                <p className="text-slate-900">{viewing.product_interest}</p>
              </div>
            )}
            <div>
              <span className="text-slate-500 block">Message</span>
              <p className="text-slate-700 whitespace-pre-wrap">{viewing.message}</p>
            </div>
            <p className="text-xs text-slate-400">
              {new Date(viewing.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
