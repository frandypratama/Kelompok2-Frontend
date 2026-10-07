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
            <span>Sistem Kasir Konter Terpadu</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
            Kelola Konter Anda <span className="text-blue-600">Lebih Cepat</span> & Akurat
          </h1>

          <p className="text-gray-600 text-base leading-relaxed">
            Platform POS modern untuk transaksi pulsa, paket data, voucher game, token listrik, kartu perdana, hingga aksesoris HP dengan manajemen stok otomatis.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all">
              Mulai Transaksi <ArrowRight size={18} />
            </button>
            <Link to="/login" className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all">
              Login Kasir
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Multi-Role (Owner/Admin/Kasir)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Stok & Kategori Bertingkat</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Digital & Fisik Terintegrasi</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Gambar & Floating Card */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md lg:l rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://refrez.com/wp-content/uploads/2023/08/konter-pulsa-760x760.png"
              alt="konter dan Aksesoris HP Modern" 
              className="w-full h-450px object-cover"
            />
          </div>
        </div>

      </section>

      {/* 2. FITUR UNGGULAN */}
      <section className="bg-gray-50/50 py-20 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3 mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Fitur Unggulan Posify</h2>
          <p className="text-gray-500 text-sm">Dirancang khusus untuk kebutuhan operasional konter.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Kasir Cepat & POS</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Transaksi produk fisik (perdana, aksesoris) dan digital (pulsa, voucher game) dalam satu kasir.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Produk Digital</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Mendukung penjualan pulsa Telkomsel, Tri, Axis, Token PLN, E-Wallet, hingga transfer bank.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Box size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Kategori Bertingkat</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pengelompokan rapi dari Kategori Utama (Fisik/Digital), Subkategori, hingga Brand/Jenis produk.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Manajemen Stok Fisik</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Kontrol stok kartu perdana, voucher fisik, dan aksesoris (kabel, charger) secara real-time.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Harga Beli & Jual</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pengaturan harga modal dan harga jual yang jelas untuk menghitung margin keuntungan konter.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Multi-Role Akses</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Hak akses terstruktur untuk Owner, Admin, dan Kasir demi keamanan operasional usaha.
            </p>
          </div>

        </div>
      </section>

      {/* 3. LAYANAN & KATEGORI PRODUK */}
      <section className="py-16 max-w-7xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Kategori & Layanan Posify</h2>
          <p className="text-gray-500 text-sm">Menyediakan produk fisik terlengkap dan produk digital instan.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            'Voucher Data (Telkomsel, Tri, Axis)', 
            'Kartu Perdana', 
            'Aksesoris HP (Kabel & Charger)', 
            'Pulsa Reguler', 
            'Token Listrik PLN', 
            'Top Up E-Wallet (Gopay, DANA, ShopeePay)', 
            'Voucher Game (FF, Mobile Legends)', 
            'Transfer Antar Bank'
          ].map((item, index) => (
            <span 
              key={index} 
              className="bg-white border border-gray-200 px-5 py-2.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm hover:border-blue-500 transition-all cursor-default flex items-center gap-2"
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
            <h2 className="text-2xl lg:text-3xl font-bold">Siap Optimalkan Bisnis Konter Anda Bersama Posify?</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Tingkatkan kecepatan pelayanan transaksi digital dan kontrol stok fisik konter Anda sekarang juga.
            </p>
          </div>
          <Link to="/login" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl shadow-md inline-flex items-center gap-2 transition-all">
            Masuk ke Aplikasi <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}