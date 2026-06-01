import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import ProductGallery from "../components/products/ProductGallery";
import Button from "../components/ui/Button";
import { fetchProduct } from "../services/productService";
import { normalizeProductImages } from "../utils/productMedia";
import { buildWhatsAppOrderUrl } from "../utils/whatsapp";
import { isHtmlContent } from "../utils/html";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchProduct(id)
      .then((res) => {
        setProduct(res.data);
        const activeSeries = (res.data.series || []).filter((s) => s.is_active);
        setSelectedSeries(activeSeries[0] || null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex justify-center py-24">
          <Loader2 className="text-gold-500 animate-spin" size={40} />
        </div>
      </PageShell>
    );
  }

  if (error || !product) {
    return (
      <PageShell>
        <div className="max-w-lg mx-auto text-center py-16">
          <p className="text-slate-600 mb-6">Product not found.</p>
          <Link to="/products" className="text-gold-600 font-semibold hover:underline">
            ← Back to catalog
          </Link>
        </div>
      </PageShell>
    );
  }

  const images = normalizeProductImages(product);
  const seriesList = (product.series || []).filter((s) => s.is_active);
  const whatsappUrl = buildWhatsAppOrderUrl({
    productName: product.name,
    seriesName: selectedSeries?.name,
    categoryTitle: product.category_title,
  });

  return (
    <PageShell className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 font-medium mb-8"
        >
          <ArrowLeft size={18} />
          Back to products
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <ProductGallery images={images} />

          <div>
            <p className="text-gold-600 text-sm font-semibold uppercase tracking-wider mb-2">
              {product.category_title || product.category_slug}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4">
              {product.name}
            </h1>

            {seriesList.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 mb-2">Select series</p>
                <div className="flex flex-wrap gap-2">
                  {seriesList.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSeries(s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selectedSeries?.id === s.id
                          ? "bg-gold-500 text-white border-gold-500"
                          : "border-gold-200 text-slate-700 hover:border-gold-400 bg-cream-50"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                {selectedSeries?.description && (
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {selectedSeries.description}
                  </p>
                )}
              </div>
            )}

            {product.description && (
              <div className="mb-8">
                {isHtmlContent(product.description) ? (
                  <div
                    className="product-description text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed">{product.description}</p>
                )}
              </div>
            )}

            <div className="p-6 rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-cream-100">
              <h2 className="font-serif text-xl text-slate-900 mb-2">Order via WhatsApp</h2>
              <p className="text-sm text-slate-600 mb-4">
                Contact us directly on WhatsApp for pricing, MOQ, and export inquiries.
              </p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full sm:w-auto bg-[#25D366] hover:from-[#22c55e] hover:to-[#16a34a] from-[#25D366] to-[#20bd5a]">
                  <MessageCircle size={20} />
                  Order on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
