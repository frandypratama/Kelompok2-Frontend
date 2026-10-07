import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import UserFormModal from "../components/UserFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { UserPlus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    role: "kasir",
  });

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // FETCH DATA USERS (Pola sesuai Kategori.jsx)
  // ==========================================
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const response = await getUsers();
        // Response backend: { message: "...", data: [...] }
        setUsers(response.data || []);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        setError("Gagal memuat data user dari server.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [refreshKey]);

  // Filter pencarian dan role
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.nama || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setFormData({ nama: "", username: "", password: "", role: "kasir" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nama: user.nama || "",
      username: user.username || "",
      password: "", // Kosongkan password saat edit agar tidak terisi otomatis
      role: user.role || "kasir",
    });
    setIsModalOpen(true);
  };

  // ==========================================
  // HANDLER SUBMIT (CREATE & UPDATE)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (selectedUser) {
        // Mode Update
        const payload = { ...formData };
        // Jika password diisi kosong saat edit, hapus dari payload agar password di DB tidak ter-overwrite
        if (!payload.password) {
          delete payload.password;
        }
        await updateUser(selectedUser.id, payload);
      } else {
        // Mode Create
        await createUser(formData);
      }

      setIsModalOpen(false);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      console.error("Gagal menyimpan user:", err);
      alert(
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // HANDLER DELETE USER
  // ==========================================
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteUser(deleteId);
      setDeleteId(null);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      alert(
        err.response?.data?.message || "Gagal menghapus user."
      );
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "No",
      render: (_, index) => index + 1,
      className: "w-16 text-center",
      tdClassName: "text-center font-medium text-slate-500",
    },
    { header: "Nama Lengkap", key: "nama" },
    { header: "Username", key: "username" },
    {
      header: "Password",
      render: () => "••••••••",
    },
    {
      header: "Role",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
            row.role === "admin"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : row.role === "manajer"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Aksi",
      className: "text-center",
      tdClassName: "text-center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Pencil size={17} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar title="Kelola User" />

        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama lengkap atau username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="all">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="kasir">Kasir</option>
                <option value="manajer">Manajer</option>
              </select>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <UserPlus size={18} />
                <span>Tambah User</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500">Memuat data user...</p>
            </div>
          ) : (
            <Table
              columns={columns}
              rows={filteredUsers}
              empty="Tidak ada data user yang ditemukan."
            />
          )}
        </div>
      </main>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!selectedUser}
        submitting={submitting}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus User Ini?"
        message="Tindakan ini tidak dapat dibatalkan. Akun ini akan dihapus permanen."
        loading={deleting}
      />
    </div>
  );
}