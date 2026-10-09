import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Printer,
  Download,
  CalendarDays,
  ReceiptText,
  Banknote,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function LaporanPenjualan() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);
      setError(
        err.response?.data?.message || "Gagal mengambil data laporan penjualan",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

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
      const cashier = String(
        trx.User?.name || trx.user?.name || trx.cashier?.name || "",
      ).toLowerCase();

      return invoice.includes(keyword) || cashier.includes(keyword);
    });
  }, [transactions, search, startDate, endDate]);

  const summary = useMemo(() => {
    let totalPenjualan = 0;
    let totalItem = 0;

    filteredTransactions.forEach((trx) => {
      totalPenjualan += Number(trx.total_price || 0);

      const items = trx.details || [];

      if (Array.isArray(items)) {
        items.forEach((item) => {
          totalItem += Number(item.quantity || 0);
        });
      }
    });

    const totalTransaksi = filteredTransactions.length;

    return {
      totalPenjualan,
      totalTransaksi,
      totalItem,
      rataRata: totalTransaksi > 0 ? totalPenjualan / totalTransaksi : 0,
    };
  }, [filteredTransactions]);

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

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

  const resetFilter = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

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
      const items = trx.details || [];
      const totalItems = Array.isArray(items)
        ? items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
        : 0;

      return [
        index + 1,
        trx.invoice_no || "-",
        formatDate(trx.createdAt),
        trx.User?.name || "Kasir",
        totalItems,
        trx.total_price || 0,
        trx.status || "completed",
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
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

  // Fungsi Cetak Khusus Laporan (Clean Print)
  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Sidebar disembunyikan saat dicetak menggunakan class Tailwind 'print:hidden' */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="print:hidden">
          <Navbar title="Laporan Penjualan" />
        </div>

        <div className="space-y-6 p-6 md:p-8">
          {/* KOP LAPORAN KHUSUS CETAK (Hanya muncul saat print) */}
          <div className="hidden print:block mb-6 text-center border-b pb-4">
            <h1 className="text-xl font-bold uppercase text-slate-900">POSify - Laporan Penjualan & Keuangan</h1>
            <p className="text-xs text-slate-600 mt-1">
              Periode Filter: {startDate || "Semua"} s/d {endDate || "Semua"} | Dicetak pada: {new Date().toLocaleString("id-ID")}
            </p>
          </div>

          {/* HEADER (Tombol aksi disembunyikan saat print) */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between print:hidden">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Laporan Penjualan
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Rekap transaksi penjualan dari database
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadTransactions}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Download size={17} />
                Export CSV
              </button>

              <button
                onClick={printReport}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
              >
                <Printer size={17} />
                Cetak Laporan
              </button>
            </div>
          </div>

          {/* FILTER (Disembunyikan saat print) */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cari transaksi
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari invoice atau nama kasir..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Dari tanggal
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Sampai tanggal
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {(search || startDate || endDate) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilter}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Reset filter
                </button>
              </div>
            )}
          </section>

          {/* SUMMARY CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Penjualan"
              value={formatRupiah(summary.totalPenjualan)}
              icon={<Banknote size={22} />}
            />
            <SummaryCard
              title="Total Transaksi"
              value={summary.totalTransaksi}
              icon={<ReceiptText size={22} />}
            />
            <SummaryCard
              title="Total Item Terjual"
              value={summary.totalItem}
              icon={<ShoppingCart size={22} />}
            />
            <SummaryCard
              title="Rata-rata Transaksi"
              value={formatRupiah(summary.rataRata)}
              icon={<TrendingUp size={22} />}
            />
          </section>

          {/* TABLE DATA YANG DIFILTER */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:border-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 print:hidden">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Riwayat Penjualan
                </h2>
                <p className="text-sm text-slate-500">
                  {filteredTransactions.length} transaksi ditemukan sesuai filter
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-blue-500" />
                Memuat laporan...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-medium text-slate-600">Belum ada transaksi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-900px print:min-w-full">
                  <thead className="bg-slate-50 print:bg-slate-100">
                    <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                      <th className="px-5 py-3">No</th>
                      <th className="px-5 py-3">Invoice</th>
                      <th className="px-5 py-3">Tanggal</th>
                      <th className="px-5 py-3">Kasir</th>
                      <th className="px-5 py-3">Item</th>
                      <th className="px-5 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((trx, index) => {
                      const items = trx.details || [];
                      const totalItems = Array.isArray(items)
                        ? items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
                        : 0;

                      return (
                        <tr key={trx.id ?? index} className="border-b border-slate-100">
                          <td className="px-5 py-4 text-sm text-slate-500">{index + 1}</td>
                          <td className="px-5 py-4 font-semibold text-blue-600 print:text-black">
                            {trx.invoice_no || "-"}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">{formatDate(trx.createdAt)}</td>
                          <td className="px-5 py-4 text-sm text-slate-700">{trx.User?.name || "Kasir"}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{totalItems} item</td>
                          <td className="px-5 py-4 text-right font-semibold text-slate-800">
                            {formatRupiah(trx.total_price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:border print:shadow-none">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">{icon}</div>
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-1 text-xl font-bold text-slate-800">{value}</h3>
    </div>
  );
}