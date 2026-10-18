import { useState, useEffect } from "react";
import Sidebar from "../layouts/Sidebar";
import Navbar from "../layouts/Navbar";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { DollarSign, ShoppingCart, Package, AlertTriangle, Receipt } from "lucide-react";
import { getTransactions } from "../services/transactionService";
import { getProducts } from "../services/productService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayCount: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Ambil data transaksi dan produk secara paralel
        const [trxRes, prodRes] = await Promise.all([
          getTransactions(),
          getProducts(),
        ]);

        const transactions = trxRes.data || trxRes || [];
        const products = prodRes.data || prodRes || [];

        // 1. Hitung Penjualan & Jumlah Transaksi Hari Ini
        const todayStr = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        let todaySalesTotal = 0;
        let todayTransactionCount = 0;

        transactions.forEach((trx) => {
          const trxDate = new Date(trx.createdAt).toISOString().split("T")[0];
          if (trxDate === todayStr) {
            todaySalesTotal += Number(trx.total_price || 0);
            todayTransactionCount += 1;
          }
        });

        // 2. Hitung Total Produk & Stok Menipis (stok <= 5)
        const totalProd = products.length;
        const lowStock = products.filter((p) => Number(p.stock || p.stok || 0) <= 5).length;

        setStats({
          todaySales: todaySalesTotal,
          todayCount: todayTransactionCount,
          totalProducts: totalProd,
          lowStockCount: lowStock,
        });

        // 3. Format Transaksi Terbaru agar sama persis dengan Riwayat Transaksi (Batasi 5 data teratas)
        const formattedRows = transactions.slice(0, 5).map((trx, index) => {
          const formattedDate = trx.createdAt
            ? new Date(trx.createdAt).toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).replace(/\./g, ":")
            : "-";

          // Badge warna metode pembayaran
          const method = trx.payment_method ? trx.payment_method.toUpperCase() : "-";
          let badgeColor = "bg-gray-100 text-gray-700";
          if (method === "TRANSFER") badgeColor = "bg-purple-100 text-purple-700";
          else if (method === "QRIS") badgeColor = "bg-amber-100 text-amber-700";
          else if (method === "CASH") badgeColor = "bg-emerald-100 text-emerald-700";

          return [
            index + 1, // Kolom No
            <div key={trx.id || index} className="flex items-center gap-2 font-medium text-gray-900">
              <Receipt size={15} className="text-blue-600 shrink-0" />
              <span>{trx.invoice_no || "-"}</span>
            </div>,
            formattedDate, // Kolom Waktu
            trx.user?.name || "Kasir", // Kolom Kasir
            <span key={`method-${trx.id || index}`} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeColor}`}>
              {method}
            </span>, // Kolom Metode dengan Badge
            `Rp ${Number(trx.total_price || 0).toLocaleString("id-ID")}`, // Kolom Total Transaksi
          ];
        });

        setRecentTransactions(formattedRows);
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 antialiased">
      {/* Sidebar Fiks/Tetap di Kiri */}
      <Sidebar />

      {/* Area Konten Utama */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header / Navbar */}
        <Navbar title="Dashboard" />

        {/* Isi Dashboard */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Section Kartu Statistik (Grid 4 Kolom Responsif dengan Opsi 2 Layout Vertikal) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
              title="Penjualan Hari Ini" 
              value={`Rp ${stats.todaySales.toLocaleString("id-ID")}`} 
              icon={<DollarSign className="w-5 h-5 text-blue-600" />} 
              note="Berdasarkan hari ini"
            />
            <StatCard 
              title="Transaksi" 
              value={stats.todayCount} 
              icon={<ShoppingCart className="w-5 h-5 text-blue-600" />} 
              note="Hari ini"
            />
            <StatCard 
              title="Produk" 
              value={stats.totalProducts} 
              icon={<Package className="w-5 h-5 text-blue-600" />} 
              note="Produk aktif"
            />
            <StatCard 
              title="Stok Menipis" 
              value={stats.lowStockCount} 
              icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} 
              note="Perlu restock"
            />
          </section>

          {/* Section Panel Transaksi Terbaru */}
          <section className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Transaksi Terbaru
              </h2>
            </div>
            
            <div className="p-6">
              {loading ? (
                <p className="text-center text-sm text-gray-500 py-4">Memuat data...</p>
              ) : (
                <Table 
                  columns={["No", "No. Faktur", "Waktu", "Kasir", "Metode", "Total Transaksi"]} 
                  rows={recentTransactions} 
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}