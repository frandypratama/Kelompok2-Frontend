import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

const ROLE_LABEL = {
  admin: "Admin",
  kasir: "Kasir",
};

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}") || {};
  } catch {
    return {};
  }
}

export default function Navbar({
  title,
  subtitle = "Kelola transaksi dengan lebih mudah.",
}) {
  const navigate = useNavigate();
  const user = readUser();

  const role = String(user.frontendRole || user.role || "")
    .trim()
    .toLowerCase();
  const displayName =
    user.name || user.nama || user.username || user.email || "Pengguna";
  const roleLabel = ROLE_LABEL[role] || "Pengguna";
  const initial = String(displayName).trim().charAt(0).toUpperCase() || "P";

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const menuRef = useRef(null);

  // Tutup menu profil: klik di luar atau tekan Escape
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Tutup dialog konfirmasi dengan tombol Escape
  useEffect(() => {
    if (!confirmLogout) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setConfirmLogout(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmLogout]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        {/* Judul & Subtitle */}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-800 md:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500 md:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Menu profil */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Menu profil"
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:pr-3"
          >
            <span className="flex h-10 w-10 select-none items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md ring-2 ring-blue-100">
              {initial}
            </span>
            <span className="hidden min-w-0 text-left md:block">
              <span className="block max-w-[10rem] truncate text-sm font-semibold text-gray-800">
                {displayName}
              </span>
              <span className="block text-xs text-gray-500">{roleLabel}</span>
            </span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`hidden text-gray-500 transition-transform md:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmLogout(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
              >
                <LogOut size={16} aria-hidden="true" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Dialog konfirmasi keluar */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-xl bg-white p-6 text-slate-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="logout-title" className="text-lg font-bold">
              Keluar dari POSify?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Anda harus login kembali untuk melanjutkan transaksi.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmLogout(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Ya, keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}