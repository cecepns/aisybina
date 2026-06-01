import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ pagination, onPageChange, onLimitChange }) {
  if (!pagination) return null;

  const { page, limit, total, totalPages } = pagination;
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Show</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-gray-200 text-sm"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>
          of {total} entries
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-gold-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-gold-500 text-charcoal-900"
                : "border border-slate-200 text-slate-700 hover:bg-gold-400/10"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-gold-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
