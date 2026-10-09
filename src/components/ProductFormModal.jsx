import { useState, useEffect } from "react";
import Modal from "./Modal";
import InputField from "./ui/InputField";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  categories = [],
}) {
  // Helper untuk menentukan selected levels berdasarkan category_id
  const getInitialLevels = () => {
    if (!formData.category_id) return { l1: "", l2: "", l3: "" };

    const catId = Number(formData.category_id);
    const currentCat = categories.find((c) => Number(c.id) === catId);

    if (!currentCat) return { l1: "", l2: "", l3: "" };

    if (currentCat.parent_id === null || currentCat.parent_id === undefined) {
      return { l1: String(currentCat.id), l2: "", l3: "" };
    }

    const parentCat = categories.find(
      (c) => Number(c.id) === Number(currentCat.parent_id)
    );

    if (!parentCat) return { l1: "", l2: "", l3: "" };

    if (parentCat.parent_id === null || parentCat.parent_id === undefined) {
      return { l1: String(parentCat.id), l2: String(currentCat.id), l3: "" };
    }

    return {
      l1: String(parentCat.parent_id),
      l2: String(parentCat.id),
      l3: String(currentCat.id),
    };
  };

  const [selectedLevels, setSelectedLevels] = useState(() => getInitialLevels());

  // Sinkronisasi ulang state level ketika modal dibuka/diedit
  useEffect(() => {
    if (isOpen) {
      setSelectedLevels(getInitialLevels());
    }
  }, [isOpen, formData.category_id]);

  // Filter Opsi Berdasarkan Level
  const level1Options = categories.filter(
    (c) => c.parent_id === null || c.parent_id === undefined
  );

  const level2Options = selectedLevels.l1
    ? categories.filter((c) => Number(c.parent_id) === Number(selectedLevels.l1))
    : [];

  const level3Options = selectedLevels.l2
    ? categories.filter((c) => Number(c.parent_id) === Number(selectedLevels.l2))
    : [];

  // Handler Perubahan Dropdown
  const handleL1Change = (e) => {
    const val = e.target.value;
    setSelectedLevels({ l1: val, l2: "", l3: "" });
    setFormData((prev) => ({ ...prev, category_id: val }));
  };

  const handleL2Change = (e) => {
    const val = e.target.value;
    setSelectedLevels((prev) => ({ ...prev, l2: val, l3: "" }));
    setFormData((prev) => ({ ...prev, category_id: val || selectedLevels.l1 }));
  };

  const handleL3Change = (e) => {
    const val = e.target.value;
    setSelectedLevels((prev) => ({ ...prev, l3: val }));
    setFormData((prev) => ({ ...prev, category_id: val || selectedLevels.l2 }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Produk" : "Tambah Produk Baru"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Nama Produkfdgfd"
          placeholder="Masukkan nama produk"
          value={formData.product_name}
          onChange={(e) =>
            setFormData({ ...formData, product_name: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Harga Beli (Rp)"
            type="number"
            placeholder="10000"
            value={formData.purchase_price}
            onChange={(e) =>
              setFormData({ ...formData, purchase_price: e.target.value })
            }
          />
          <InputField
            label="Harga Jual (Rp)"
            type="number"
            placeholder="15000"
            value={formData.selling_price}
            onChange={(e) =>
              setFormData({ ...formData, selling_price: e.target.value })
            }
          />
        </div>

        <InputField
          label="Stok"
          type="number"
          placeholder="0"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
        />

        {/* Dropdown Kategori Cascading */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600">
            Kategori
          </label>

          {/* Level 1 */}
          <select
            value={selectedLevels.l1}
            onChange={handleL1Change}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
          >
            <option value="">Pilih Kategori Utama (Level 1)</option>
            {level1Options.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name || cat.nama_kategori}
              </option>
            ))}
          </select>

          {/* Level 2 */}
          {selectedLevels.l1 && level2Options.length > 0 && (
            <select
              value={selectedLevels.l2}
              onChange={handleL2Change}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            >
              <option value="">Pilih Sub-Kategori (Level 2)</option>
              {level2Options.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name || cat.nama_kategori}
                </option>
              ))}
            </select>
          )}

          {/* Level 3 */}
          {selectedLevels.l2 && level3Options.length > 0 && (
            <select
              value={selectedLevels.l3}
              onChange={handleL3Change}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            >
              <option value="">Pilih Sub-Sub-Kategori (Level 3)</option>
              {level3Options.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name || cat.nama_kategori}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
}