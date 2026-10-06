import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Receipt, 
  BarChart3, 
  LogOut,
  Store,
  Users
} from "lucide-react";

const menus = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/user", "Kelola User", Users], // Menu Baru
  ["/kasir", "Kasir", ShoppingCart],
  ["/product", "Produk", Package],
  ["/stok", "Stok", Boxes],
  ["/transaksi", "Transaksi", Receipt],
  ["/laporan", "Laporan", BarChart3],
];

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-blue-600 text-white min-h-screen flex flex-col justify-between p-4 border-r border-blue-500/50 shrink-0 shadow-lg">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-blue-500/60">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white">
            <Store className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            POS<span className="text-blue-200 font-extrabold">ify</span>
          </span>
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-1.5">
          {menus.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-md font-semibold"
                    : "text-blue-100 hover:bg-blue-500/80 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Tombol Logout */}
      <div className="pt-4 border-t border-blue-500/60">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-red-500 hover:text-white transition-colors duration-150 cursor-pointer"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}