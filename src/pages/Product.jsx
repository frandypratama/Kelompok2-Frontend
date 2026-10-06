<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useMemo } from "react";
>>>>>>> 8e606f7 (product page)
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

<<<<<<< HEAD
const dummyCategories = [
  { id: 1, nama_kategori: "Minuman" },
  { id: 2, nama_kategori: "Makanan" },
  { id: 3, nama_kategori: "Snack" },
=======
// Data Kategori Lengkap (ID 1 - 29) sesuai gambar database
const dummyCategories = [
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
>>>>>>> 8e606f7 (product page)
];

const initialProducts = [
  {
    id: 1,
<<<<<<< HEAD
    nama_produk: "Kopi Susu Aren",
    harga_beli: 10000,
    harga_jual: 18000,
    stok: 50,
    kategori_id: 1,
    kategori_nama: "Minuman",
  },
  {
    id: 2,
    nama_produk: "Roti Bakar Cokelat",
    harga_beli: 12000,
    harga_jual: 20000,
    stok: 20,
    kategori_id: 2,
    kategori_nama: "Makanan",
=======
    nama_produk: "Paket Data Telkomsel 10GB",
    harga_beli: 30000,
    harga_jual: 35000,
    stok: 100,
    kategori_id: 11,
  },
  {
    id: 2,
    nama_produk: "Pulsa Telkomsel 20k",
    harga_beli: 20000,
    harga_jual: 22000,
    stok: 50,
    kategori_id: 19,
  },
  {
    id: 3,
    nama_produk: "Top Up Gopay 50k",
    harga_beli: 50000,
    harga_jual: 52000,
    stok: 20,
    kategori_id: 23,
>>>>>>> 8e606f7 (product page)
  },
];

export default function Product() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
<<<<<<< HEAD
  const [filterCategory, setFilterCategory] = useState("all");
=======

  // State Filter Cascading
  const [filterL1, setFilterL1] = useState("");
  const [filterL2, setFilterL2] = useState("");
  const [filterL3, setFilterL3] = useState("");
>>>>>>> 8e606f7 (product page)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nama_produk: "",
    harga_beli: "",
    harga_jual: "",
    stok: "",
    kategori_id: "",
  });

  const [deleteId, setDeleteId] = useState(null);

<<<<<<< HEAD
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      filterCategory === "all" || String(p.kategori_id) === String(filterCategory);
=======
  // Helper mendapatkan nama kategori berdasarkan ID
  const getCategoryName = (catId) => {
    const found = dummyCategories.find((c) => String(c.id) === String(catId));
    return found ? found.nama_kategori : "-";
  };

  // Helper untuk mengambil semua ID anak/cucu secara rekursif
  const getAllChildCategoryIds = (parentId) => {
    let ids = [Number(parentId)];
    const children = dummyCategories.filter((c) => c.parent_id === Number(parentId));
    children.forEach((child) => {
      ids = [...ids, ...getAllChildCategoryIds(child.id)];
    });
    return ids;
  };

  // Opsi Dropdown Filter Bertingkat
  const level1Options = useMemo(
    () => dummyCategories.filter((c) => c.parent_id === null),
    []
  );

  const level2Options = useMemo(() => {
    if (!filterL1) return [];
    return dummyCategories.filter((c) => c.parent_id === Number(filterL1));
  }, [filterL1]);

  const level3Options = useMemo(() => {
    if (!filterL2) return [];
    return dummyCategories.filter((c) => c.parent_id === Number(filterL2));
  }, [filterL2]);

  // Filter Produk
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());

    let targetCatId = filterL3 || filterL2 || filterL1;
    let matchCategory = true;

    if (targetCatId) {
      const allowedIds = getAllChildCategoryIds(targetCatId);
      matchCategory = allowedIds.includes(Number(p.kategori_id));
    }

>>>>>>> 8e606f7 (product page)
    return matchSearch && matchCategory;
  });

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      nama_produk: "",
      harga_beli: "",
      harga_jual: "",
      stok: "",
      kategori_id: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      nama_produk: product.nama_produk,
      harga_beli: product.harga_beli,
      harga_jual: product.harga_jual,
      stok: product.stok,
      kategori_id: product.kategori_id || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    const catName =
      dummyCategories.find((c) => String(c.id) === String(formData.kategori_id))
        ?.nama_kategori || "-";

    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? { ...p, ...formData, kategori_nama: catName }
            : p
        )
      );
    } else {
      setProducts([...products, { id: Date.now(), ...formData, kategori_nama: catName }]);
=======
    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...formData } : p
        )
      );
    } else {
      setProducts([...products, { id: Date.now(), ...formData }]);
>>>>>>> 8e606f7 (product page)
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setProducts(products.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

<<<<<<< HEAD
  // Kolom No menggunakan index baris (index + 1)
=======
>>>>>>> 8e606f7 (product page)
  const columns = [
    {
      header: "No",
      render: (_, index) => index + 1,
      className: "w-16 text-center",
      tdClassName: "text-center font-medium text-slate-500",
    },
    { header: "Nama Produk", key: "nama_produk" },
    {
      header: "Kategori",
<<<<<<< HEAD
      render: (row) => row.kategori_nama || "-",
=======
      render: (row) => getCategoryName(row.kategori_id),
>>>>>>> 8e606f7 (product page)
    },
    {
      header: "Harga Beli",
      render: (row) => `Rp ${Number(row.harga_beli).toLocaleString("id-ID")}`,
    },
    {
      header: "Harga Jual",
      render: (row) => `Rp ${Number(row.harga_jual).toLocaleString("id-ID")}`,
    },
    { header: "Stok", key: "stok" },
    {
      header: "Aksi",
      className: "text-center",
      tdClassName: "text-center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil size={17} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
        <Navbar title="Kelola Produk" />

        <div className="p-6 md:p-8 space-y-6">
<<<<<<< HEAD
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
=======
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 justify-between items-center">
            {/* Search Bar */}
>>>>>>> 8e606f7 (product page)
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

<<<<<<< HEAD
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="all">Semua Kategori</option>
                {dummyCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama_kategori}
=======
            {/* Cascading Filter Kategori */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              {/* Level 1 Filter */}
              <select
                value={filterL1}
                onChange={(e) => {
                  setFilterL1(e.target.value);
                  setFilterL2("");
                  setFilterL3("");
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="">Semua Kategori</option>
                {level1Options.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama_kategori}
>>>>>>> 8e606f7 (product page)
                  </option>
                ))}
              </select>

<<<<<<< HEAD
=======
              {/* Level 2 Filter */}
              {level2Options.length > 0 && (
                <select
                  value={filterL2}
                  onChange={(e) => {
                    setFilterL2(e.target.value);
                    setFilterL3("");
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="">Semua Sub-Kategori</option>
                  {level2Options.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              )}

              {/* Level 3 Filter */}
              {level3Options.length > 0 && (
                <select
                  value={filterL3}
                  onChange={(e) => setFilterL3(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="">Semua Sub-Sub-Kategori</option>
                  {level3Options.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              )}

>>>>>>> 8e606f7 (product page)
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus size={18} />
                <span>Tambah Produk</span>
              </button>
            </div>
          </div>

          <Table
            columns={columns}
            rows={filteredProducts}
            empty="Tidak ada produk yang ditemukan."
          />
        </div>
      </main>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!selectedProduct}
        categories={dummyCategories}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk Ini?"
        message="Data produk akan dihapus permanen dari sistem."
      />
    </div>
  );
}