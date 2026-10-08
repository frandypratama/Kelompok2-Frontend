import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // Belum login
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Data user tidak valid:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // Cek role
  if (!allowedRoles.includes(user.frontendRole)) {
    // Admin/kasir tidak punya akses ke halaman tersebut
    if (user.frontendRole === "karyawan") {
      return <Navigate to="/penjualan" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}