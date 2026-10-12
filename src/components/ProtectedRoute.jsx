import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // Periksa status login
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);

    if (!user || typeof user !== "object") {
      throw new Error("Data user tidak valid");
    }
  } catch (error) {
    console.error("Data user tidak valid:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // Normalisasi role
  const role = String(
    user.frontendRole || user.role || ""
  ).trim().toLowerCase();

  // Seragamkan menjadi "admin" atau "kasir"
  const currentRole = ["admin", "owner"].includes(role)
    ? "admin"
    : ["karyawan", "kasir", "user"].includes(role)
    ? "kasir" // Diubah dari "karyawan" menjadi "kasir"
    : "";

  // Tolak akses jika role tidak sesuai
  if (!currentRole || !allowedRoles.includes(currentRole)) {
    if (currentRole === "kasir") {
      return <Navigate to="/pos" replace />;
    }

    if (currentRole === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}