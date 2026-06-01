import { Link } from "react-router-dom";
import { Mail, MapPin, Globe } from "lucide-react";
import { useCatalogContext } from "../../context/CatalogContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { categories } = useCatalogContext();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-start">
            <img
              src="/logo.png"
              alt="Aisybina Export"
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Indonesian export company delivering premium children&apos;s fashion
              and frozen groceries to local and international markets.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg text-gold-400 mb-4">Product Lines</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?category=${encodeURIComponent(cat.slug || cat.id)}`}
                      className="hover:text-gold-300 transition-colors"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>Muslim Koko Clothes for Children</li>
                  <li>Children&apos;s School Uniforms</li>
                  <li>Frozen Groceries</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-gold-400 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Globe size={16} className="text-gold-500 shrink-0" />
                <span>Indonesia — Global Export</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <a
                  href="mailto:info@aisybinaexport.com"
                  className="hover:text-gold-300 transition-colors"
                >
                  info@aisybinaexport.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-gold-500 shrink-0 mt-0.5" />
                <span>Indonesia</span>
              </li>
            </ul>
            <Link
              to="/contact"
              className="inline-block mt-4 text-sm text-gold-400 hover:text-gold-300 font-medium"
            >
              Send inquiry →
            </Link>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent my-8" />
        <p className="text-center text-xs text-slate-500">
          © {year} Aisybina Export. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
