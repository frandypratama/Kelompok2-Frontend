import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identity: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Langsung navigasi ke dashboard tanpa validasi/API call
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // (Opsional) Simpan dummy token untuk keperluan testing
    localStorage.setItem('token', 'dummy-token-123');

    // Langsung arahkan ke halaman dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans antialiased text-gray-800">
      {/* Kolom Kiri: Banner Gradien & Branding */}
      <div className="relative w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-8 md:p-12 flex flex-col justify-between text-white min-h-[280px] md:min-h-screen">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold tracking-wider text-lg">POSify</span>
        </div>

        <div className="my-auto py-10 md:py-0 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Sistem Kasir Konter
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Transaksi cepat, stok otomatis, dan laporan akurat dalam satu platform profesional.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-6">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Beranda
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Masuk ke Akun Anda</h2>
            <p className="text-xs text-gray-500 mt-1">Gunakan username dan password Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identity" className="block text-xs font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="identity"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                placeholder="admin123"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all duration-150 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}