export default function Table({ columns = [], rows = [], empty = "Belum ada data." }) {
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
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold select-none">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || col.header || idx}
                scope="col"
                className={`px-6 py-3.5 whitespace-nowrap ${col.className || ""}`}
              >
                {typeof col === "string" ? col : col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.length ? (
            rows.map((row, i) => (
              <tr
                key={row.id || i}
                className="hover:bg-gray-50/80 transition-colors duration-150 ease-in-out"
              >
                {Array.isArray(row)
                  ? row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-6 py-4 whitespace-nowrap font-medium text-gray-800"
                      >
                        {renderCellContent(cell)}
                      </td>
                    ))
                  : columns.map((col, j) => (
                      <td
                        key={col.key || j}
                        className={`px-6 py-4 whitespace-nowrap font-medium text-gray-800 ${
                          col.tdClassName || ""
                        }`}
                      >
                        {/* PERBAIKAN DI SINI: Kirim 'i' (index baris) sebagai parameter kedua */}
                        {col.render
                          ? col.render(row, i)
                          : renderCellContent(row[col.key])}
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