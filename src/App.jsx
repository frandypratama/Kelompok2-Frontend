
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Product from "./pages/Product";
import Category from "./pages/Category";
import HomePage from "./pages/homePage";
import Pos from "./pages/Pos";
import TransactionHistory from "./pages/TransactionHistory";
import LaporanPenjualan from "./pages/LaporanPenjualan";
import Pengeluaran from "./pages/Pengeluaran";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Halaman umum */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

      {/* Khusus Admin */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <User />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Product />
          </ProtectedRoute>
        }
      />

      <Route
        path="/category"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Category />
          </ProtectedRoute>
        }
      />

      <Route
        path="/laporan"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <LaporanPenjualan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/laporan-penjualan"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <LaporanPenjualan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pengeluaran"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Pengeluaran />
          </ProtectedRoute>
        }
      />

      {/* Kasir dan Admin boleh mengakses Kasir */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute allowedRoles={["admin", "karyawan"]}>
            <Pos />
          </ProtectedRoute>
        }
      />

      {/* Kasir dan Admin boleh mengakses Transaksi */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute allowedRoles={["admin", "karyawan"]}>
            <TransactionHistory />
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