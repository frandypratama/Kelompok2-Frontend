export default function Table({ columns, rows, empty = "Belum ada data." }) {
  // Fungsi penolong untuk memberikan warna badge pada status
  const renderCellContent = (cell) => {
    if (typeof cell === "string") {
      const lowerCell = cell.toLowerCase();
      if (lowerCell === "selesai" || lowerCell === "success") {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {cell}
          </span>
        );
      }
      if (lowerCell === "pending" || lowerCell === "proses") {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {cell}
          </span>
        );
      }
      if (lowerCell === "batal" || lowerCell === "failed") {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            {cell}
          </span>
        );
      }
    }
    return cell;
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm text-gray-700 divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold select-none">
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className="px-6 py-3.5 whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.length ? (
            rows.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50/80 transition-colors duration-150 ease-in-out"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-6 py-4 whitespace-nowrap font-medium text-gray-800"
                  >
                    {renderCellContent(cell)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm font-medium text-gray-400 bg-gray-50/50"
              >
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}