export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Logika standar industri untuk menampilkan deretan nomor halaman (mengatasi jika halaman terlalu banyak)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);

      if (page <= 3) {
        end = Math.min(totalPages, maxVisiblePages);
      } else if (page >= totalPages - 2) {
        start = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Tombol Sebelumnya («) */}
      <button
        type="button"
        className="flex items-center justify-center h-10 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        «
      </button>

      {/* Daftar Kotak Nomor Halaman (Lebih besar & sudut agak bundar) */}
      {getPageNumbers().map((p) => (
        <button
          key={p}
          type="button"
          className={`flex items-center justify-center h-10 min-w-[40px] px-3 rounded-xl border text-sm font-semibold transition-colors shadow-sm ${
            page === p
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {/* Tombol Selanjutnya (») */}
      <button
        type="button"
        className="flex items-center justify-center h-10 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        »
      </button>
    </div>
  );
}