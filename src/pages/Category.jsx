import { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CategoryFormModal from "../components/CategoryFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search } from "lucide-react";
import CategoryAccordion from "../components/CategoryAccordion";
// Perbaikan: Sesuaikan path dan penamaan file service menjadi lowercase (categoryService.js)
import { getCategory, createCategory, updateCategory, deleteCategory } from "../services/categoryService.js";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    nama_kategori: "", // Diselaraskan menggunakan nama_kategori
    parent_id: null,
  });

  const [deleteId, setDeleteId] = useState(null);

  const flattenCategories = (nestedData) => {
    let flatList = [];
    const recurse = (items, parentId = null) => {
      items.forEach((item) => {
        const name = item.category_name || item.nama_kategori;
        flatList.push({
          id: item.id,
          nama_kategori: name,
          parent_id: item.parent_id !== undefined ? item.parent_id : parentId,
        });

        if (item.subcategories && item.subcategories.length > 0) {
          recurse(item.subcategories, item.id);
        }
      });
    };
    recurse(nestedData);
    return flatList;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await getCategory(); // Menggunakan service getCategory[cite: 24]
      const flatData = flattenCategories(result.data);
      setCategories(flatData);
    } catch (err) {
      console.error("Gagal memuat Category:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const filteredCategories = sortedTreeCategories.filter((c) =>
    c.nama_kategori?.toLowerCase().includes(search.toLowerCase())
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        category_name: formData.nama_kategori, // Menyesuaikan dengan field backend
        parent_id: formData.parent_id,
      };

      if (selectedCategory) {
        await updateCategory(selectedCategory.id, payload); // Menggunakan service update[cite: 24]
      } else {
        await createCategory(payload); // Menggunakan service create[cite: 24]
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Gagal menyimpan Category:", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(deleteId); // Menggunakan service delete[cite: 24]
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      console.error("Gagal menghapus Category:", err);
    }
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

          {loading ? (
            <p className="text-center py-6 text-slate-500">Memuat data kategori...</p>
          ) : (
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
          )}
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