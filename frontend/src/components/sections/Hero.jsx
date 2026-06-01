import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, Package, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import { useCatalogContext } from "../../context/CatalogContext";

export default function Hero() {
  const navigate = useNavigate();
  const { categories, loading, allProducts } = useCatalogContext();

  const productLinesText =
    categories.length > 0
      ? categories.map((c) => c.shortTitle).join(", ")
      : "Muslim koko, school uniforms, and frozen groceries";

  const goToCategory = (categoryId) => {
    navigate(`/products?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-cream-100 via-cream-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15)_0%,_transparent_60%)]" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-100/40 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <div className="animate-fade-up">
          <img
            src="/logo.png"
            alt="Aisybina Export"
            className="h-28 sm:h-36 md:h-44 w-auto mx-auto object-contain mb-8 drop-shadow-lg"
          />

          <p className="text-gold-600 text-sm md:text-base font-semibold tracking-[0.25em] uppercase mb-4">
            Unlimited Creativity, Endless Innovation
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight mb-6">
            Premium Indonesian{" "}
            <span className="gold-gradient-text">Export Products</span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            High-quality {productLinesText} — crafted with authenticity for local
            and global markets.
          </p>

          {!loading && allProducts.length > 0 && (
            <p className="text-gold-700 text-sm font-medium mb-8">
              {allProducts.length} products available across {categories.length} export lines
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button onClick={() => navigate("/products")}>
              <Package size={18} />
              Browse Catalog
            </Button>
            <Button variant="outline" onClick={() => navigate("/contact")}>
              Partner With Us
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="text-gold-500 animate-spin" size={28} />
            </div>
          ) : (
            categories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                {categories.map((cat) => {
                  const CatIcon = cat.icon;
                  const preview = cat.items?.[0];
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => goToCategory(cat.id)}
                      className="group p-4 rounded-2xl border border-gold-200/80 bg-white shadow-card hover:shadow-soft hover:border-gold-300 transition-all text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gold-50">
                          <CatIcon className="text-gold-600" size={20} />
                        </div>
                        <span className="font-semibold text-slate-800 text-sm group-hover:text-gold-700">
                          {cat.shortTitle}
                        </span>
                      </div>
                      {/* {preview?.imageUrl ? (
                        <img
                          src={preview.imageUrl}
                          alt=""
                          className="h-20 w-full object-cover rounded-lg mb-2"
                        />
                      ) : null} */}
                      <p className="text-xs text-slate-500 line-clamp-2">{cat.tagline}</p>
                      <p className="text-xs text-gold-600 font-medium mt-2">
                        {cat.items?.length || 0} products →
                      </p>
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>

        <Link
          to="/about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-500 hover:text-gold-600 animate-bounce"
          aria-label="Go to about page"
        >
          <ArrowDown size={28} />
        </Link>
      </div>
    </section>
  );
}
