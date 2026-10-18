import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import InputField from "./ui/InputField";
import { API_URL } from "../services/api";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  categories = [],
}) {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // State untuk menampung pilihan Kategori Utama (Level 1) dan Sub-Kategori (Level 2)
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedSubCatId, setSelectedSubCatId] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (formData.image) {
        setPreview(`${API_URL}/uploads/${formData.image}`);
      } else {
        setPreview(null);
      }
      setImageFile(null);

      // Inisialisasi data saat modal dibuka / diedit
      if (formData.category_id) {
        const currentCat = categories.find((c) => Number(c.id) === Number(formData.category_id));
        if (currentCat) {
          if (currentCat.parent_id) {
            // Jika yang tersimpan adalah sub-kategori
            setSelectedParentId(String(currentCat.parent_id));
            setSelectedSubCatId(String(currentCat.id));
          } else {
            // Jika yang tersimpan adalah kategori utama
            setSelectedParentId(String(currentCat.id));
            setSelectedSubCatId("");
          }
        }
      } else {
        setSelectedParentId("");
        setSelectedSubCatId("");
      }
    }
  }, [isOpen, formData, categories]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2 MB");
      e.target.value = "";
      return;
    }

    if (preview && !formData.image) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("purchase_price", formData.purchase_price);
    data.append("selling_price", formData.selling_price);
    data.append("stock", formData.stock);

    // KUNCI: Kirim ID sub-kategori jika dipilih, jika tidak kirim ID kategori utama ke database
    const finalCategoryId = selectedSubCatId || selectedParentId;
    data.append("category_id", finalCategoryId);

    if (imageFile) {
      data.append("image", imageFile);
    }

    onSubmit(data);
  };

  // Kategori Utama (Level 1)
  const level1Options = categories.filter(
    (c) => c.parent_id === null || c.parent_id === undefined || c.parent_id === 0
  );

  // Sub-Kategori (Level 2) berdasarkan Kategori Utama yang dipilih
  const level2Options = selectedParentId
    ? categories.filter((c) => Number(c.parent_id) === Number(selectedParentId))
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Produk" : "Tambah Produk Baru"}
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <InputField
          label="Nama Produk"
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

        {/* Dropdown Kategori Utama (Parent) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600">
            Kategori Utama
          </label>
          <select
            value={selectedParentId}
            onChange={(e) => {
              setSelectedParentId(e.target.value);
              setSelectedSubCatId(""); // Reset sub-kategori saat parent diubah
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none bg-white"
          >
            <option value="">Pilih Kategori Utama</option>
            {level1Options.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name || cat.nama_kategori}
              </option>
            ))}
          </select>

          {/* Dropdown Sub-Kategori */}
          {selectedParentId && level2Options.length > 0 && (
            <>
              <label className="block text-xs font-semibold text-slate-600 pt-1">
                Sub-Kategori
              </label>
              <select
                value={selectedSubCatId}
                onChange={(e) => setSelectedSubCatId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none bg-white"
              >
                <option value="">Pilih Sub-Kategori</option>
                {level2Options.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name || cat.nama_kategori}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Input Upload Gambar */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600">
            Foto Produk (JPG/PNG/WEBP, maks. 2MB)
          </label>
          <input
            type="file"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-lg"
          />
        </div>

        {preview && (
          <div>
            <span className="block text-xs font-semibold text-slate-500 mb-1">Preview:</span>
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 rounded-lg border object-cover shadow-sm"
            />
          </div>
        )}

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