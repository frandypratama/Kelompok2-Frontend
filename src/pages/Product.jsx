import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";

// Data Kategori tetap menggunakan dummyCategories agar dropdown dan helper tidak berubah[cite: 3, 17]
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
];

export default function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // State Filter Cascading[cite: 3, 17]
  const [filterL1, setFilterL1] = useState("");
  const [filterL2, setFilterL2] = useState("");
  const [filterL3, setFilterL3] = useState("");

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

  // Ambil data produk langsung dari database saat komponen dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const prodRes = await getProducts();
      const productList = Array.isArray(prodRes) 
        ? prodRes 
        : (Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []));
      
      // Memetakan kolom database agar sesuai dengan state frontend (nama_produk, harga_beli, dll)
      const mapped = productList.map(p => ({
        id: p.id,
        nama_produk: p.product_name || p.nama_produk,
        harga_beli: p.purchase_price !== undefined ? p.purchase_price : p.harga_beli,
        harga_jual: p.selling_price !== undefined ? p.selling_price : p.harga_jual,
        stok: p.stock !== undefined ? p.stock : p.stok,
        kategori_id: p.category_id !== undefined ? p.category_id : p.kategori_id,
      }));

      setProducts(mapped);
    } catch (error) {
      console.error("Gagal memuat produk dari database:", error);
    }
  };

  // Helper mendapatkan nama kategori berdasarkan ID[cite: 3, 17]
  const getCategoryName = (catId) => {
    const found = dummyCategories.find((c) => String(c.id) === String(catId));
    return found ? found.nama_kategori : "-";
  };

  // Helper untuk mengambil semua ID anak/cucu secara rekursif[cite: 3, 17]
  const getAllChildCategoryIds = (parentId) => {
    let ids = [Number(parentId)];
    const children = dummyCategories.filter((c) => c.parent_id === Number(parentId));
    children.forEach((child) => {
      ids = [...ids, ...getAllChildCategoryIds(child.id)];
    });
    return ids;
  };

  // Opsi Dropdown Filter Bertingkat[cite: 3, 17]
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

  // Filter Produk[cite: 3, 17]
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());

    let targetCatId = filterL3 || filterL2 || filterL1;
    let matchCategory = true;

    if (targetCatId) {
      const allowedIds = getAllChildCategoryIds(targetCatId);
      matchCategory = allowedIds.includes(Number(p.kategori_id));
    }

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

  const handleSubmit = async (e) => {
       
    e.preventDefault();
    
    try {
      const payload = {
        product_name: formData.product_name,
        purchase_price: Number(formData.purchase_price),
        selling_price: Number(formData.selling_price),
        stock: Number(formData.stock),
        category_id: Number(formData.category_id),
      };
      // console.log("ata",payload); untuk menampilkan data terkirim dari form 

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
    }
  };

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
      render: (row) => getCategoryName(row.kategori_id),
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
        <Navbar title="Kelola Produk" />

        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 justify-between items-center">
            {/* Search Bar */}
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

            {/* Cascading Filter Kategori (Logika dropdown dipertahankan utuh)[cite: 3, 17] */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              {/* Level 1 Filter */}
              <select
                value={filterL1}
                onChange={(e) => {
                  setFilterL1(e.target.value);
                  setFilterL2("");
                  setFilterL3("");
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              >
                <option value="">Semua Kategori</option>
                {level1Options.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama_kategori}
                  </option>
                ))}
              </select>

              {/* Level 2 Filter */}
              {level2Options.length > 0 && (
                <select
                  value={filterL2}
                  onChange={(e) => {
                    setFilterL2(e.target.value);
                    setFilterL3("");
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
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
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                >
                  <option value="">Semua Sub-Sub-Kategori</option>
                  {level3Options.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              )}

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