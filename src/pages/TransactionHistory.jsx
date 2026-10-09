import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TransactionDetailModal from "../components/TransactionDetailModal";
import axios from "axios";
import { 
  Search, 
  Eye, 
  Receipt, 
  Calendar, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk Sorting
  const [sortField, setSortField] = useState("createdAt"); 
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' | 'desc'

  // Ambil data transaksi dari API backend
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/transactions"); // Sesuaikan URL backend kamu jika berbeda
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fungsi Toggle Sorting saat Header Klik
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Helper untuk Merender Ikon Panah Sorting
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-slate-400 opacity-60" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={14} className="text-blue-600 font-bold" />
    ) : (
      <ArrowDown size={14} className="text-blue-600 font-bold" />
    );
  };

  // Process Filtering & Sorting
  const processedTransactions = useMemo(() => {
    let result = transactions.filter((trx) => {
      const matchSearch = trx.invoice_no.toLowerCase().includes(search.toLowerCase());
      const matchPayment = paymentFilter === "" || trx.payment_method === paymentFilter;
      return matchSearch && matchPayment;
    });

    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [transactions, search, paymentFilter, sortField, sortOrder]);

  const handleOpenDetail = (trx) => {
    setSelectedTransaction(trx);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar title="Riwayat Transaksi" />

        <div className="p-4 md:p-6 space-y-5">
          {/* BARIS FILTER & SEARCH */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari No. Faktur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full sm:w-52 px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
              >
                <option value="">Semua Pembayaran</option>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
          </div>

          {/* TABEL RIWAYAT TRANSAKSI */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                  <tr>
                    <th className="p-4 text-center w-16">No</th>
                    <th onClick={() => handleSort("invoice_no")} className="p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <span>No. Faktur</span>
                        {renderSortIcon("invoice_no")}
                      </div>
                    </th>
                    <th onClick={() => handleSort("createdAt")} className="p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <span>Waktu</span>
                        {renderSortIcon("createdAt")}
                      </div>
                    </th>
                    <th className="p-4">Kasir</th>
                    <th className="p-4">Metode</th>
                    <th className="p-4 text-right">Total Transaksi</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                        Memuat data transaksi...
                      </td>
                    </tr>
                  ) : processedTransactions.length > 0 ? (
                    processedTransactions.map((trx, index) => (
                      <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-center font-medium text-slate-500">
                          {index + 1}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          <div className="inline-flex items-center gap-2">
                            <Receipt size={17} className="text-blue-600 shrink-0" />
                            <span>{trx.invoice_no}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">
                          <div className="inline-flex items-center gap-2">
                            <Calendar size={15} className="text-slate-400" />
                            <span>{new Date(trx.createdAt).toLocaleString("id-ID")}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{trx.user?.name || "Kasir"}</td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              trx.payment_method === "cash"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : trx.payment_method === "transfer"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {trx.payment_method}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-900 text-base">
                          Rp {trx.total_price.toLocaleString("id-ID")}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(trx)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                        Tidak ada riwayat transaksi ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Detail Transaksi */}
      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}