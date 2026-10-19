import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Printer,
  Download,
  ReceiptText,
  Banknote,
  ShoppingCart,
  TrendingUp,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import api from "../../services/api";
import Sidebar from "../../layouts/Sidebar";
import Navbar from "../../layouts/Navbar";
import TransactionDetailModal from "../../components/TransactionDetailModal";

export default function LaporanPenjualan() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State pencarian dan filter tanggal
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State modal detail transaksi
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format angka menjadi Rupiah
  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  // Format tanggal transaksi
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  // Mengambil nama kasir
  const getCashierName = (trx) =>
    trx.User?.name ||
    trx.user?.name ||
    trx.cashier?.name ||
    "Kasir";

  // Mengambil transaksi dari backend
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/transactions");

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setTransactions(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);

      setError(
        err.response?.data?.message ||
          "Gagal mengambil data laporan penjualan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filter transaksi berdasarkan pencarian dan tanggal
  const filteredTransactions = useMemo(() => {
    return transactions.filter((trx) => {
      const createdAt = new Date(trx.createdAt);

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);

        if (createdAt < start) return false;
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`);

        if (createdAt > end) return false;
      }

      const keyword = search.toLowerCase().trim();

      if (!keyword) return true;

      const invoice = String(trx.invoice_no || "").toLowerCase();
      const cashier = getCashierName(trx).toLowerCase();

      return (
        invoice.includes(keyword) ||
        cashier.includes(keyword)
      );
    });
  }, [transactions, search, startDate, endDate]);

  // Reset halaman saat filter atau jumlah data berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate, itemsPerPage]);

  // Menghitung jumlah halaman
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / itemsPerPage)
  );

  // Menjaga halaman aktif tetap valid jika jumlah data berubah
  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  // Data transaksi untuk halaman aktif
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredTransactions.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Informasi rentang data
  const startIndex =
    filteredTransactions.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endIndex = Math.min(
    currentPage * itemsPerPage,
    filteredTransactions.length
  );

  // Nomor halaman yang ditampilkan
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Ringkasan dihitung dari semua data yang sesuai filter
  const summary = useMemo(() => {
    let totalPenjualan = 0;
    let totalItem = 0;

    filteredTransactions.forEach((trx) => {
      totalPenjualan += Number(trx.total_price || 0);

      const items = Array.isArray(trx.details)
        ? trx.details
        : [];

      items.forEach((item) => {
        totalItem += Number(item.quantity || 0);
      });
    });

    const totalTransaksi = filteredTransactions.length;

    return {
      totalPenjualan,
      totalTransaksi,
      totalItem,
      rataRata:
        totalTransaksi > 0
          ? totalPenjualan / totalTransaksi
          : 0,
    };
  }, [filteredTransactions]);

  // Reset semua filter
  const resetFilter = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Buka modal detail transaksi
  const handleOpenDetail = (trx) => {
    setSelectedTransaction(trx);
    setIsModalOpen(true);
  };

  // Tutup modal detail transaksi
  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Export seluruh hasil filter menjadi CSV
  const exportCSV = () => {
    if (filteredTransactions.length === 0) {
      window.alert("Tidak ada data transaksi untuk diekspor.");
      return;
    }

    const header = [
      "No",
      "Invoice",
      "Tanggal",
      "Kasir",
      "Item",
      "Total",
      "Status",
    ];

    const rows = filteredTransactions.map((trx, index) => {
      const items = Array.isArray(trx.details)
        ? trx.details
        : [];

      const totalItems = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      return [
        index + 1,
        trx.invoice_no || "-",
        formatDate(trx.createdAt),
        getCashierName(trx),
        totalItems,
        Number(trx.total_price || 0),
        trx.status || "completed",
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `laporan-penjualan-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Cetak laporan halaman aktif
  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Sidebar */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Navbar */}
        <div className="print:hidden">
          <Navbar title="Laporan Penjualan" />
        </div>

        <div className="space-y-6 p-4 md:p-8">
          {/* Header cetak */}
          <div className="mb-6 hidden border-b pb-4 text-center print:block">
            <h1 className="text-xl font-bold uppercase text-slate-900">
              POSify - Laporan Penjualan
            </h1>

            <p className="mt-2 text-xs text-slate-600">
              Periode: {startDate || "Semua"} s/d {endDate || "Semua"}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Dicetak pada: {new Date().toLocaleString("id-ID")}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>

          {/* Header halaman dan tombol aksi */}
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between print:hidden">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Laporan Penjualan
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Rekap transaksi penjualan dari database POSify.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadTransactions}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={exportCSV}
                disabled={loading || filteredTransactions.length === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Download size={17} />
                Export CSV
              </button>

              <button
                type="button"
                onClick={printReport}
                disabled={loading || filteredTransactions.length === 0}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:opacity-50"
              >
                <Printer size={17} />
                Cetak Laporan
              </button>
            </div>
          </section>

          {/* Pesan error */}
          {error && (
            <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <p>{error}</p>

              <button
                type="button"
                onClick={loadTransactions}
                className="flex items-center gap-2 self-start font-semibold hover:underline sm:self-auto"
              >
                <RotateCcw size={15} />
                Coba Lagi
              </button>
            </div>
          )}

          {/* Filter laporan */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label
                  htmlFor="searchTransaction"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Cari transaksi
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="searchTransaction"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari invoice atau nama kasir..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Dari tanggal
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Sampai tanggal
                </label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            {(search || startDate || endDate) && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={resetFilter}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Reset filter
                </button>
              </div>
            )}
          </section>

          {/* Kartu ringkasan */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Penjualan"
              value={formatRupiah(summary.totalPenjualan)}
              icon={<Banknote size={22} />}
            />

            <SummaryCard
              title="Total Transaksi"
              value={summary.totalTransaksi.toLocaleString("id-ID")}
              icon={<ReceiptText size={22} />}
            />

            <SummaryCard
              title="Total Item Terjual"
              value={summary.totalItem.toLocaleString("id-ID")}
              icon={<ShoppingCart size={22} />}
            />

            <SummaryCard
              title="Rata-rata Transaksi"
              value={formatRupiah(summary.rataRata)}
              icon={<TrendingUp size={22} />}
            />
          </section>

          {/* Tabel laporan */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:border-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 print:hidden">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Riwayat Penjualan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredTransactions.length} transaksi ditemukan
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                <RefreshCw
                  size={24}
                  className="mx-auto mb-3 animate-spin text-blue-500"
                />
                Memuat laporan...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-sm text-red-600">
                Data laporan gagal dimuat. Silakan coba lagi.
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-10 text-center">
                <ReceiptText
                  size={36}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="font-medium text-slate-600">
                  Belum ada transaksi
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Data transaksi tidak ditemukan sesuai filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="bg-slate-50 print:bg-slate-100">
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="px-5 py-3">No</th>
                      <th className="px-5 py-3">Invoice</th>
                      <th className="px-5 py-3">Tanggal</th>
                      <th className="px-5 py-3">Kasir</th>
                      <th className="px-5 py-3 text-center">Item</th>
                      <th className="px-5 py-3 text-right">Total</th>
                      <th className="px-5 py-3 text-center print:hidden">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedTransactions.map((trx, index) => {
                      const items = Array.isArray(trx.details)
                        ? trx.details
                        : [];

                      const totalItems = items.reduce(
                        (sum, item) =>
                          sum + Number(item.quantity || 0),
                        0
                      );

                      return (
                        <tr
                          key={trx.id ?? trx.invoice_no ?? index}
                          className="border-b border-slate-100 transition hover:bg-slate-50 print:hover:bg-white"
                        >
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {startIndex + index}
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-blue-600 print:text-black">
                            {trx.invoice_no || "-"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                            {formatDate(trx.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {getCashierName(trx)}
                          </td>

                          <td className="px-5 py-4 text-center text-sm text-slate-600">
                            {totalItems}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-slate-800">
                            {formatRupiah(trx.total_price)}
                          </td>

                          <td className="px-5 py-4 text-center print:hidden">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(trx)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              title="Lihat detail transaksi"
                            >
                              <Eye size={15} />
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot className="border-t-2 border-slate-200 bg-slate-50 print:bg-white">
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-4 text-sm font-bold text-slate-700"
                      >
                        TOTAL PENJUALAN
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-bold text-blue-700 print:text-black">
                        {formatRupiah(summary.totalPenjualan)}
                      </td>

                      <td className="print:hidden" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>

          {/* Pagination */}
          {!loading && !error && filteredTransactions.length > 0 && (
            <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between print:hidden">
              {/* Informasi jumlah data dan pilihan halaman */}
              <div className="flex flex-col gap-2 text-sm text-slate-500">
                <span>
                  Menampilkan{" "}
                  <strong className="text-slate-800">
                    {startIndex}
                  </strong>
                  {" - "}
                  <strong className="text-slate-800">
                    {endIndex}
                  </strong>
                  {" dari "}
                  <strong className="text-slate-800">
                    {filteredTransactions.length}
                  </strong>{" "}
                  transaksi
                </span>

                <div className="flex items-center gap-2">
                  <label htmlFor="itemsPerPage">
                    Data per halaman:
                  </label>

                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) =>
                      setItemsPerPage(Number(e.target.value))
                    }
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Navigasi halaman */}
              <div className="flex flex-wrap items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                {pageNumbers[0] > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      className="min-w-9 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                      1
                    </button>

                    {pageNumbers[0] > 2 && (
                      <span className="px-1 text-slate-400">
                        ...
                      </span>
                    )}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    className={`min-w-9 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] <
                      totalPages - 1 && (
                      <span className="px-1 text-slate-400">
                        ...
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className="min-w-9 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">Berikutnya</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>
          )}

          {/* Catatan laporan */}
          <p className="text-xs text-slate-400 print:hidden">
            Laporan dihitung berdasarkan semua transaksi yang sesuai
            dengan filter pencarian dan periode tanggal. Pagination
            hanya membatasi jumlah baris yang ditampilkan.
          </p>
        </div>
      </main>

      {/* Modal detail transaksi */}
      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        transaction={selectedTransaction}
      />
    </div>
  );
}

// Komponen kartu ringkasan
function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid print:shadow-none">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-1 break-words text-xl font-bold text-slate-800">
        {value}
      </h3>
    </div>
  );
}
