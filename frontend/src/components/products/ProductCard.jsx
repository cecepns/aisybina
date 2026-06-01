import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { isHtmlContent, stripHtml } from "../../utils/html";

export default function ProductCard({ item, categoryTitle, imageClassName = "h-40" }) {
  const descriptionPreview = item.description
    ? isHtmlContent(item.description)
      ? stripHtml(item.description)
      : item.description
    : "";

  return (
    <article className="group flex flex-col h-full rounded-2xl border border-gold-100 bg-white overflow-hidden shadow-card hover:shadow-soft hover:border-gold-200 transition-all duration-300">
      <Link to={`/products/${item.id}`} className="block">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className={`${imageClassName} w-full object-cover group-hover:scale-[1.02] transition-transform duration-300`}
          />
        ) : (
          <div className="h-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600" />
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-gold-600 font-semibold uppercase tracking-wider mb-2">
          {categoryTitle}
        </span>
        <Link to={`/products/${item.id}`}>
          <h4 className="font-serif text-lg text-slate-900 group-hover:text-gold-700 transition-colors mb-2">
            {item.name}
          </h4>
        </Link>
        {item.series?.length > 0 && (
          <p className="text-xs text-slate-500 mb-2">
            {item.series.length} series available
          </p>
        )}
        {descriptionPreview ? (
          <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4 line-clamp-3">
            {descriptionPreview}
          </p>
        ) : (
          <div className="flex-1 mb-4" />
        )}
        <Link
          to={`/products/${item.id}`}
          className="inline-flex items-center gap-1 text-sm text-gold-600 hover:text-gold-700 font-semibold transition-colors mt-auto"
        >
          View details
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
