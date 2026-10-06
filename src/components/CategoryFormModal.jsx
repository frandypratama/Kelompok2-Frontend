import Modal from "./Modal";
import InputField from "./ui/InputField";

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  categories = [],
}) {
  // Susun daftar pilihan induk dengan label hirarki (misal: "Fisik > Voucher")
  const buildParentOptions = () => {
    const options = [];

    // Kategori Level 1
    const level1List = categories.filter((c) => c.parent_id === null);

    level1List.forEach((l1) => {
      // Jangan tampilkan kategori itu sendiri jika sedang di-edit (mencegah siklus)
      if (isEdit && l1.id === formData.id) return;

      options.push({ id: l1.id, label: l1.nama_kategori });

      // Kategori Level 2 (bisa jadi parent untuk Level 3)
      const level2List = categories.filter((c) => c.parent_id === l1.id);
      level2List.forEach((l2) => {
        if (isEdit && l2.id === formData.id) return;

        options.push({
          id: l2.id,
          label: `${l1.nama_kategori} ➔ ${l2.nama_kategori}`,
        });
      });
    });

    return options;
  };

  const parentOptions = buildParentOptions();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Nama Kategori"
          type="text"
          placeholder="Masukkan nama kategori"
          value={formData.nama_kategori}
          onChange={(e) =>
            setFormData({ ...formData, nama_kategori: e.target.value })
          }
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Kategori Induk (Parent)
          </label>
          <select
            value={formData.parent_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                parent_id: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="">
              -- Tanpa Induk (Jadikan Kategori Utama / Level 1) --
            </option>
            {parentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            Pilih induk jika kategori ini merupakan sub-kategori.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            {isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
          </button>
        </div>
      </form>
    </Modal>
  );
}