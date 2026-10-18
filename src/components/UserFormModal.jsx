import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Modal from "./ui/Modal";
import InputField from "./ui/InputField";

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  submitting = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Tambah User Baru"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Input Nama Lengkap */}
        <InputField
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        {/* Input Username */}
        <InputField
          label="Username"
          placeholder="Masukkan username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        {/* Input Password */}
        <div>
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder={isEdit ? "Kosongkan jika tidak diubah" : "••••••••"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!isEdit}
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </InputField>
          {isEdit && (
            <p className="mt-1 text-xs text-slate-400">
              *Isi hanya jika ingin mengganti password lama.
            </p>
          )}
        </div>

        {/* Radio Card Role */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Opsi Admin */}
            <label className={`flex items-center justify-center px-3 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
              formData.role === "admin" 
                ? "bg-green-50 border-green-600 text-green-700 shadow-xs" 
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="sr-only" // Menyembunyikan radio bawaan browser
              />
              Admin
            </label>

            {/* Opsi Kasir */}
            <label className={`flex items-center justify-center px-3 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
              formData.role === "kasir" 
                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs" 
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}>
              <input
                type="radio"
                name="role"
                value="kasir"
                checked={formData.role === "kasir"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="sr-only"
              />
              Kasir
            </label>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 min-w-[90px]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}