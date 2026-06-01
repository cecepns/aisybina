import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutGrid, Loader2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "../products/ProductCard";
import { useCatalogContext } from "../../context/CatalogContext";

const VIEW_ALL = "all";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories, loading, allProducts } = useCatalogContext();
  const [activeCategory, setActiveCategory] = useState(VIEW_ALL);

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (!categories.length) return;
    if (categoryParam) {
      const match = categories.find(
        (c) => c.id === categoryParam || c.slug === categoryParam
      );
      if (match) {
        setActiveCategory(match.id);
        return;
      }
    }
    setActiveCategory(VIEW_ALL);
  }, [categories, categoryParam]);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail) setActiveCategory(e.detail);
    };
    window.addEventListener("aisybina:set-category", handler);
    return () => window.removeEventListener("aisybina:set-category", handler);
  }, []);

  const isViewAll = activeCategory === VIEW_ALL;
  const current = isViewAll ? null : categories.find((c) => c.id === activeCategory);
  const Icon = current?.icon;
  const displayProducts = isViewAll ? allProducts : current?.items || [];

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === VIEW_ALL) {
      navigate("/products", { replace: true });
    } else {
      navigate(`/products?category=${encodeURIComponent(categoryId)}`, { replace: true });
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="flex justify-center py-20">
          <Loader2 className="text-gold-500 animate-spin" size={40} />
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Catalog"
          title="Our Products"
          subtitle="Explore our export product lines — quality-crafted for international standards."
        />

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          <button
            type="button"
            onClick={() => selectCategory(VIEW_ALL)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              isViewAll
                ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-soft"
                : "border border-gold-200 bg-cream-50 text-slate-700 hover:border-gold-400 hover:bg-gold-50"
            }`}
          >
            <LayoutGrid size={18} />
            <span>View All</span>
            <span className={`text-xs ${isViewAll ? "text-gold-100" : "text-slate-400"}`}>
              ({allProducts.length})
            </span>
          </button>
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => selectCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-soft"
                    : "border border-gold-200 bg-cream-50 text-slate-700 hover:border-gold-400 hover:bg-gold-50"
                }`}
              >
                <CatIcon size={18} />
                <span className="hidden sm:inline">{cat.shortTitle}</span>
                <span className="sm:hidden">{cat.shortTitle?.split(" ")[0]}</span>
                <span className={`text-xs ${isActive ? "text-gold-100" : "text-slate-400"}`}>
                  ({cat.items?.length || 0})
                </span>
              </button>
            );
          })}
        </div>

        <div className="animate-fade-up">
          {isViewAll ? (
            <div className="flex items-start gap-4 mb-10 p-6 md:p-8 rounded-2xl border border-gold-200 bg-cream-50 shadow-card">
              <div className="p-4 rounded-xl bg-gold-100 border border-gold-200">
                <LayoutGrid className="text-gold-600" size={36} />
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-slate-900 mb-2">
                  All Products
                </h3>
                <p className="text-gold-700 text-sm font-medium">
                  Browse our full export catalog across {categories.length} product lines.
                </p>
              </div>
            </div>
          ) : (
            current && (
              <>
                <div className="flex flex-col lg:flex-row gap-8 mb-10 p-6 md:p-8 rounded-2xl border border-gold-200 bg-cream-50 shadow-card">
                  <div className="flex items-start gap-4 lg:max-w-md shrink-0">
                    <div className="p-4 rounded-xl bg-gold-100 border border-gold-200">
                      {Icon && <Icon className="text-gold-600" size={36} />}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl text-slate-900 mb-2">
                        {current.title}
                      </h3>
                      <p className="text-gold-700 text-sm font-medium">{current.tagline}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed lg:flex-1 lg:pt-2">
                    {current.description}
                  </p>
                </div>

                {current.highlights?.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mb-8">
                    {current.highlights.map((h) => (
                      <li
                        key={h}
                        className="text-xs px-3 py-1.5 rounded-full border border-gold-200 text-gold-800 bg-gold-50 font-medium"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )
          )}

          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {displayProducts.map((item) => (
                <ProductCard
                  key={isViewAll ? `${item.categorySlug}-${item.id}` : item.id}
                  item={
                    isViewAll
                      ? item
                      : { ...item, categorySlug: current.slug || current.id }
                  }
                  categoryTitle={isViewAll ? item.categoryTitle : current.shortTitle}
                  imageClassName="h-64 md:h-96"
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">
              {isViewAll
                ? "No products available yet."
                : "No products in this category yet."}
            </p>
          )}
        </div>
        
      </div>
    </section>
  );
}
