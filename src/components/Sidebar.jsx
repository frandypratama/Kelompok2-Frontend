import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  BarChart3,
  LogOut,
  Store,
  Users,
  Layers,
  Wallet,
} from "lucide-react";

const menuAdmin = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/user", "Kelola User", Users],
  ["/category", "Kategori", Layers],
  ["/product", "Produk", Package],
  ["/pos", "Kasir", ShoppingCart],
  ["/transactions", "Transaksi", Receipt],
  ["/pengeluaran", "Pengeluaran", Wallet],
  ["/laporan", "Laporan", BarChart3],
];

const menuKasir = [
  ["/pos", "Kasir", ShoppingCart],
  ["/transactions", "Transaksi", Receipt],
];

export default function Sidebar() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }
  const role = String(
  user.frontendRole || user.role || ""
).trim().toLowerCase();

const isAdmin = ["admin", "owner"].includes(role);
const isKasir = ["karyawan", "kasir", "user"].includes(role);

const menus = isAdmin
  ? menuAdmin
  : isKasir
  ? menuKasir
  : [];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col justify-between border-r border-blue-500/50 bg-blue-600 p-4 text-white shadow-lg">
      <div>
        <div className="mb-6 flex items-center space-x-3 border-b border-blue-500/60 px-3 py-4">
          <div className="rounded-lg bg-white/20 p-2">
            <Store className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-wide">
            POS<span className="font-extrabold text-blue-200">ify</span>
          </span>
        </div>

        <nav className="space-y-1.5">
          {menus.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white font-semibold text-blue-600 shadow-md"
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

      <div className="border-t border-blue-500/60 pt-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-blue-100 transition-colors hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}