import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Product from "./pages/Product";
import Category from "./pages/Category";
import HomePage from "./pages/homePage";
import LaporanPenjualan from "./pages/Report";
import Pos from "./pages/Pos";
import TransactionHistory from "./pages/TransactionHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import LaporanUangKeluar from "./pages/LaporanUangKeluar";

// Komponen pembatas: Jika sudah login, dilarang masuk ke halaman login/landing
function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (token && userStr) {
    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      // Jika parsing error, abaikan
    }

    if (user) {
      const userRole = String(user.role || "").trim().toLowerCase();
      const frontRole = String(user.frontendRole || "").trim().toLowerCase();

      // Jika role-nya admin atau owner, arahkan ke dashboard. Jika kasir, arahkan ke pos.
      if (userRole === "admin" || userRole === "owner" || frontRole === "admin") {
        return <Navigate to="/dashboard" replace />;
      } else if (frontRole === "kasir") {
        return <Navigate to="/pos" replace />;
      }
    }
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Halaman umum / Publik */}
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        } 
      />

      {/* Khusus Admin */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <User />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product"
        element={
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <Product />
          </ProtectedRoute>
        }
      />

      <Route
        path="/category"
        element={
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <Category />
          </ProtectedRoute>
        }
      />

      <Route
        path="/laporan"
        element={
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <LaporanPenjualan />
          </ProtectedRoute>
        }
      />

      {/* Kasir dan Admin boleh mengakses Kasir (POS) */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute allowedRoles={["admin", "owner", "kasir"]}>
            <Pos />
          </ProtectedRoute>
        }
      />

      {/* Kasir dan Admin boleh mengakses Riwayat Transaksi */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute allowedRoles={["admin", "owner", "kasir"]}>
            <TransactionHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/laporan-uang-keluar"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <LaporanUangKeluar />
          </ProtectedRoute>
        }
        />
      {/* URL tidak dikenal */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default App;