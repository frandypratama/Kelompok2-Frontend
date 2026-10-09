import React from "react";

export default function CategoryFormModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit, categories }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kategori</label>
            <input
              type="text"
              required
              value={formData.nama_kategori}
              onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
              placeholder="Contoh: Voucher, Pulsa, dll"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Induk (Parent)</label>
            <select
              value={formData.parent_id || ""}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="">-- Tanpa Induk (Kategori Utama) --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nama_kategori}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}