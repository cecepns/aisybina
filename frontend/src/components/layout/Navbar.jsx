import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/vision-mission", label: "Vision & Mission" },
  { to: "/values", label: "Values" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-gold-600" : "text-slate-600 hover:text-gold-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block py-2.5 px-2 rounded-lg transition-colors ${
      isActive
        ? "text-gold-700 bg-gold-50"
        : "text-slate-600 hover:text-gold-600 hover:bg-gold-50"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || location.pathname !== "/"
          ? "bg-white/95 backdrop-blur-md border-b border-gold-200/60 shadow-card"
          : "bg-cream-50/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center shrink-0" aria-label="Aisybina Export home">
            <img
              src="/logo.png"
              alt="Aisybina Export"
              className="h-14 md:h-18 w-auto object-contain"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="lg:hidden p-2 text-gold-600 hover:text-gold-700"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 border-t border-gold-200/60 pt-3">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={mobileLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
