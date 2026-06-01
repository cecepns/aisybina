export default function AdminTable({ columns, data, loading, emptyMessage = "No data found" }) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-16 text-slate-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-gold-400/90 font-medium whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-gold-400/5 hover:bg-white/[0.02] transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-slate-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
