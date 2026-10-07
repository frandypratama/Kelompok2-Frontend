import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CategoryFormModal from "../components/CategoryFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search } from "lucide-react";
import CategoryAccordion from "../components/CategoryAccordion";

// Data dummy sesuai sampel database
const initialCategories = [
  { id: 1, nama_kategori: "Fisik", parent_id: null },
  { id: 2, nama_kategori: "Digital", parent_id: null },
  { id: 3, nama_kategori: "Voucher", parent_id: 1 },
  { id: 4, nama_kategori: "Kartu Prabayar", parent_id: 1 },
  { id: 5, nama_kategori: "Aksesoris", parent_id: 1 },
  { id: 6, nama_kategori: "Pulsa", parent_id: 2 },
  { id: 7, nama_kategori: "Token Listrik", parent_id: 2 },
  { id: 8, nama_kategori: "E-Wallet", parent_id: 2 },
  { id: 9, nama_kategori: "Voucher Game", parent_id: 2 },
  { id: 10, nama_kategori: "Transfer Antar Bank", parent_id: 2 },
  { id: 11, nama_kategori: "Telkomsel", parent_id: 3 },
  { id: 12, nama_kategori: "Tri (3)", parent_id: 3 },
  { id: 13, nama_kategori: "Axis", parent_id: 3 },
  { id: 14, nama_kategori: "Telkomsel Prabayar", parent_id: 4 },
  { id: 15, nama_kategori: "Tri Prabayar", parent_id: 4 },
  { id: 16, nama_kategori: "Axis Prabayar", parent_id: 4 },
  { id: 17, nama_kategori: "Kabel Charger", parent_id: 5 },
  { id: 18, nama_kategori: "Adapter Charger", parent_id: 5 },
  { id: 19, nama_kategori: "Pulsa Telkomsel", parent_id: 6 },
  { id: 20, nama_kategori: "Pulsa Tri", parent_id: 6 },
  { id: 21, nama_kategori: "Pulsa Axis", parent_id: 6 },
  { id: 22, nama_kategori: "Token PLN", parent_id: 7 },
  { id: 23, nama_kategori: "Gopay", parent_id: 8 },
  { id: 24, nama_kategori: "DANA", parent_id: 8 },
  { id: 25, nama_kategori: "ShopeePay", parent_id: 8 },
  { id: 26, nama_kategori: "Free Fire", parent_id: 9 },
  { id: 27, nama_kategori: "Mobile Legends", parent_id: 9 },
  { id: 28, nama_kategori: "Bank BRI", parent_id: 10 },
  { id: 29, nama_kategori: "Bank Seabank", parent_id: 10 },
];

export default function Category() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    nama_kategori: "",
    parent_id: null,
  });

  const [deleteId, setDeleteId] = useState(null);

  // Mengurutkan hirarki data (Tree Flattening)
  const sortedTreeCategories = useMemo(() => {
    const result = [];

    const buildTree = (parentId = null, depth = 0) => {
      const children = categories.filter((c) => c.parent_id === parentId);
      children.forEach((child) => {
        result.push({ ...child, depth, level: depth + 1 });
        buildTree(child.id, depth + 1);
      });
    };

    buildTree(null, 0);
    return result;
  }, [categories]);

  // Filter pencarian
  const filteredCategories = sortedTreeCategories.filter((c) =>
    c.nama_kategori.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setFormData({ nama_kategori: "", parent_id: null });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      nama_kategori: category.nama_kategori,
      parent_id: category.parent_id,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newCategory = {
        id: Date.now(),
        ...formData,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    // Hapus kategori beserta anak-anaknya (cascade)
    const getIdsToDelete = (id) => {
      let ids = [id];
      const children = categories.filter((c) => c.parent_id === id);
      children.forEach((child) => {
        ids = [...ids, ...getIdsToDelete(child.id)];
      });
      return ids;
    };

    const idsToDelete = getIdsToDelete(deleteId);
    setCategories((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
    setDeleteId(null);
  };


  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar title="Kelola Kategori" />

        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <CategoryAccordion
            categories={filteredCategories}
            onEdit={handleOpenEditModal}
            onDelete={(id) => setDeleteId(id)}
            onAddSub={(parentCat) => {
              setSelectedCategory(null);
              setFormData({ nama_kategori: "", parent_id: parentCat.id });
              setIsModalOpen(true);
            }}
          />
        </div>
      </main>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!selectedCategory}
        categories={categories}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori Ini?"
        message="Menghapus kategori induk juga akan menghapus semua sub-kategori di bawahnya secara permanen."
      />
    </div>
  );
}