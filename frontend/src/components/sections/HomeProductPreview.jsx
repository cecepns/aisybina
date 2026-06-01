import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCatalogContext } from "../../context/CatalogContext";
import ProductCard from "../products/ProductCard";

export default function HomeProductPreview() {
  const { categories, loading, featuredProducts } = useCatalogContext();

  if (loading) {
    return (
      <section className="py-12 bg-white border-y border-gold-100">
        <div className="flex justify-center py-8">
          <Loader2 className="text-gold-500 animate-spin" size={32} />
        </div>
      </section>
    );
  }

  if (!featuredProducts.length) return null;

  return (
    <section className="py-12 md:py-16 bg-white border-y border-gold-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Featured
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900">
              Popular <span className="gold-gradient-text">Export Products</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-gold-600 hover:text-gold-700 font-semibold"
          >
            View full catalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featuredProducts.slice(0, 8).map((item) => (
            <ProductCard
              key={`${item.categorySlug}-${item.id}`}
              item={item}
              categoryTitle={item.categoryTitle}
              imageClassName="h-64 sm:h-56 md:h-96"
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.id)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-200 bg-cream-50 text-sm text-slate-700 hover:border-gold-400 hover:bg-gold-50 transition-colors"
              >
                <CatIcon size={16} className="text-gold-600" />
                {cat.shortTitle}
                <span className="text-xs text-slate-400">({cat.items?.length || 0})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
