import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Smartphone, 
  Box, 
  Database, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Kolom Kiri: Teks & Aksi */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <span>Sistem Kasir Minimarket + PPOB</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
            Kelola Minimarket Anda <span className="text-blue-600">Lebih Cepat</span> & Cerdas
          </h1>

          <p className="text-gray-600 text-base leading-relaxed">
            Platform POS modern dengan transaksi kasir instan, pembayaran PPOB, manajemen stok otomatis, dan laporan bisnis akurat — semua dalam satu aplikasi.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all">
              Mulai Sekarang <ArrowRight size={18} />
            </button>
            <Link to="/login" className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all">
              Login
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Transaksi aman</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Stok otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Laporan realtime</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Gambar & Floating Card */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80" 
              alt="Rak Minimarket Modern" 
              className="w-full h-450px object-cover"
            />
            {/* Floating Card Penjualan */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Penjualan Hari Ini</p>
                <p className="text-lg font-bold text-gray-900">Rp 4.280.000</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 2. FITUR UNGGULAN */}
      <section className="bg-gray-50/50 py-20 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3 mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Fitur Unggulan</h2>
          <p className="text-gray-500 text-sm">Semua yang dibutuhkan untuk menjalankan minimarket modern.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Kasir Cepat</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              POS modern dengan scan barcode, keranjang realtime, diskon & pajak otomatis.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">PPOB Terintegrasi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pulsa, Token PLN, E-Wallet, BPJS, PDAM, Voucher Game dalam satu layar.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Box size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Manajemen Produk</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Kelola produk, kategori, SKU & barcode dengan foto dan margin otomatis.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Stok Otomatis</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Stok berkurang otomatis tiap transaksi dengan riwayat lengkap.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Laporan Akurat</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Laporan penjualan, profit, produk & PPOB dengan chart dan export.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Role & Keamanan</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Akses Admin, Manager, Kasir dengan JWT & kontrol permission di backend.
            </p>
          </div>

        </div>
      </section>

      {/* 3. LAYANAN PPOB LENGKAP */}
      <section className="py-16 max-w-7xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Layanan PPOB Lengkap</h2>
          <p className="text-gray-500 text-sm">Satu aplikasi untuk semua kebutuhan pembayaran digital.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {['Pulsa', 'Paket Data', 'Token PLN', 'PLN Pascabayar', 'E-Wallet', 'BPJS', 'PDAM', 'Voucher Game'].map((item, index) => (
            <span 
              key={index} 
              className="bg-white border border-gray-200 px-5 py-2.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm hover:border-blue-500 transition-all cursor-default"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 4. CTA BANNER BAWAH */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-3xl p-10 text-center text-white space-y-6 shadow-xl shadow-blue-600/20">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold">Siap Tingkatkan Bisnis Anda?</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Bergabunglah dengan minimarket modern untuk operasional harian.
            </p>
          </div>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl shadow-md inline-flex items-center gap-2 transition-all">
            Mulai Sekarang <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
}