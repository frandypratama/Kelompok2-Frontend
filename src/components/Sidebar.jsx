import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  BarChart3,
  Store,
  Users,
  Layers,
  Wallet,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// Menu dikelompokkan supaya mudah dipindai. Format item: [path, label, ikon]
const menuAdmin = [
  {
    title: "Operasional",
    items: [
      ["/dashboard", "Dashboard", LayoutDashboard],
      ["/pos", "Kasir (POS)", ShoppingCart],
      ["/transactions", "Riwayat Transaksi", Receipt],
    ],
  },
  {
    title: "Inventori",
    items: [
      ["/product", "Produk", Package],
      ["/category", "Kategori", Layers],
    ],
  },
  {
    title: "Laporan",
    items: [
      ["/laporan", "Laporan Penjualan", BarChart3],
      ["/laporan-uang-keluar", "Laporan Uang Keluar", Wallet],
    ],
  },
  {
    title: "Pengaturan",
    items: [["/user", "Kelola User", Users]],
  },
];

const menuKasir = [
  {
    title: "Operasional",
    items: [
      ["/pos", "Kasir (POS)", ShoppingCart],
      ["/transactions", "Riwayat Transaksi", Receipt],
    ],
  },
];

const COLLAPSE_KEY = "sidebarCollapsed";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}") || {};
  } catch {
    return {};
  }
}

export default function Sidebar({ badges = {} }) {
  const user = readUser();

  const role = String(user.frontendRole || user.role || "")
    .trim()
    .toLowerCase();

  const isAdmin = ["admin", "owner"].includes(role);
  const isKasir = ["karyawan", "kasir", "user"].includes(role);

  const groups = isAdmin ? menuAdmin : isKasir ? menuKasir : [];
  const homePath = isAdmin ? "/dashboard" : "/pos";

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // abaikan jika penyimpanan tidak tersedia
      }
      return next;
    });
  };

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-blue-500/50 bg-blue-600 text-white shadow-lg transition-[width] duration-200 ${
        collapsed ? "w-20 p-3" : "w-64 p-4"
      }`}
    >
      {/* Header: logo + tombol ciutkan menu */}
      <div
        className={`mb-4 flex items-center border-b border-blue-500/60 ${
          collapsed ? "flex-col gap-2 py-3" : "justify-between gap-2 py-4"
        }`}
      >
        {/* Logo: klik untuk kembali ke halaman utama sesuai peran */}
        <Link
          to={homePath}
          title="POSify"
          className={`flex min-w-0 items-center rounded-lg ${focusRing} ${
            collapsed ? "justify-center" : "space-x-3 px-2"
          }`}
        >
          <div className="rounded-lg bg-white/20 p-2">
            <Store className="h-5 w-5" aria-hidden="true" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-wide">
              POS<span className="font-extrabold text-blue-200">ify</span>
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Perluas menu" : "Ciutkan menu"}
          aria-expanded={!collapsed}
          title={collapsed ? "Perluas menu" : "Ciutkan menu"}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-100 transition-colors hover:bg-blue-500/80 hover:text-white ${focusRing}`}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        aria-label="Menu utama"
        className="-mr-1 flex-1 space-y-4 overflow-y-auto pr-1"
      >
        {groups.map((group, index) => (
          <div key={group.title}>
            {collapsed ? (
              index > 0 && (
                <div className="mx-3 mb-2 border-t border-blue-500/60" />
              )
            ) : (
              <p className="px-3.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                {group.title}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map(([to, label, Icon]) => {
                const badge = Number(badges[to]) || 0;

                return (
                  <NavLink
                    key={to}
                    to={to}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `relative flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-150 ${focusRing} ${
                        collapsed ? "justify-center px-0" : "gap-3 px-3.5"
                      } ${
                        isActive
                          ? "bg-white font-semibold text-blue-600 shadow-md"
                          : "text-blue-100 hover:bg-blue-500/80 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={19} className="shrink-0" aria-hidden="true" />
                    <span className={collapsed ? "sr-only" : "flex-1 truncate"}>
                      {label}
                    </span>

                    {badge > 0 &&
                      (collapsed ? (
                        <span
                          className="absolute right-3 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-blue-600"
                          aria-label={`${badge} perlu perhatian`}
                        />
                      ) : (
                        <span
                          className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold leading-none text-white"
                          aria-label={`${badge} perlu perhatian`}
                        >
                          {badge > 99 ? "99+" : badge}
                        </span>
                      ))}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}