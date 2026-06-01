import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Mail,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const LINKS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: FolderTree, label: "Categories" },
  { to: "/admin/inquiries", icon: Mail, label: "Inquiries" },
];

export default function AdminSidebar({ open, onClose }) {
  const { logout, admin } = useAuth();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <img src="/logo.png" alt="Aisybina" className="h-9 w-auto" />
          <button
            type="button"
            className="lg:hidden p-1 text-slate-600 hover:text-gold-700"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {LINKS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold-500/15 text-gold-700 border border-gold-400/25"
                    : "text-slate-600 hover:text-gold-200 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 truncate mb-2">{admin?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
