export default function Navbar({ title }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Judul & Subtitle */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">
          Kelola transaksi Konter dengan lebih mudah.
        </p>
      </div>

      {/* Avatar User */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center shadow-md ring-2 ring-blue-100 hover:bg-blue-700 transition-colors cursor-pointer select-none">
          A
        </div>
      </div>
    </header>
  );
}