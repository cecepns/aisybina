import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, FolderTree, Mail, ArrowRight } from "lucide-react";
import { get } from "../../utils/request";
import { API_ENDPOINTS } from "../../utils/endpoints";

const CARDS = [
  { key: "products", label: "Total Products", icon: Package, to: "/admin/products", color: "text-gold-400" },
  { key: "categories", label: "Categories", icon: FolderTree, to: "/admin/categories", color: "text-blue-400" },
  { key: "newInquiries", label: "New Inquiries", icon: Mail, to: "/admin/inquiries", color: "text-emerald-400" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(API_ENDPOINTS.DASHBOARD.STATS)
      .then((res) => setStats(res.data))
      .catch(() => setStats({ products: 0, categories: 0, newInquiries: 0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-gold-700 mb-2">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Overview of your catalog and inquiries</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ key, label, icon: Icon, to, color }) => (
          <Link
            key={key}
            to={to}
            className="p-6 rounded-xl border border-slate-200 bg-white/50 hover:border-gold-400/30 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <Icon className={color} size={28} />
              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:text-gold-400 transition-colors"
              />
            </div>
            <p className="text-slate-500 text-sm mt-4">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {loading ? "—" : stats?.[key] ?? 0}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
