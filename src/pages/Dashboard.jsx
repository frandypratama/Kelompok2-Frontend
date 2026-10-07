import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { DollarSign, ShoppingCart, Package, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const rows = [
    ["TRX-001", "Budi", "3 item", "Rp125.000", "Selesai"],
    ["TRX-002", "Siti", "5 item", "Rp240.000", "Selesai"],
    ["TRX-003", "Andi", "2 item", "Rp78.000", "Pending"],
  ];

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
          {/* Section Kartu Statistik (Grid 4 Kolom Responsif) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
              title="Penjualan Hari Ini" 
              value="Rp 4,2 Jt" 
              icon={<DollarSign className="w-5 h-5 text-blue-600" />} 
              note="+12,5% dari kemarin"
            />
            <StatCard 
              title="Transaksi" 
              value="128" 
              icon={<ShoppingCart className="w-5 h-5 text-blue-600" />} 
              note="Hari ini"
            />
            <StatCard 
              title="Produk" 
              value="842" 
              icon={<Package className="w-5 h-5 text-blue-600" />} 
              note="Produk aktif"
            />
            <StatCard 
              title="Stok Menipis" 
              value="17" 
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
              <Table 
                columns={["ID Transaksi", "Kasir", "Item", "Total", "Status"]} 
                rows={rows} 
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}