import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import Pagination from "../components/Pagination"; // 1. Impor komponen Pagination
import ProductFormModal from "../components/ProductFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import { getCategory } from "../services/categoryService";
import { API_URL } from "../services/api";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [filterL1, setFilterL1] = useState("");
  const [filterL2, setFilterL2] = useState("");
  const [filterL3, setFilterL3] = useState("");


// State untuk Pagination dan Sorting (Default: Terbaru berdasarkan id DESC)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("id"); // Ubah dari "createdAt" menjadi "id"
  const [order, setOrder] = useState("DESC"); // "DESC" berarti dari yang terbesar (terbaru) ke terkecil
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    product_name: "",
    purchase_price: "",
    selling_price: "",
    stock: "",
    category_id: "",
    image: null, 
  });

  const [deleteId, setDeleteId] = useState(null);

  // Ambil data kategori sekali saat pertama kali dibuka
  useEffect(() => {
    fetchCategories();
  }, []);

  // 3. Ambil data produk setiap kali pencarian, filter, halaman, atau sorting berubah
  useEffect(() => {
    fetchProducts();
  }, [search, filterL1, filterL2, filterL3, page, limit, sort, order]);

  const fetchProducts = async () => {
    try {
      const targetCatId = filterL3 || filterL2 || filterL1;
      
      // Kirim parameter query ke backend service
      const response = await getProducts({
        search,
        category_id: targetCatId,
        page,
        limit,
        sort,
        order,
      });

      const productList = response.data || [];
      
      const mapped = productList.map(p => ({
        id: p.id,
        product_name: p.product_name || p.nama_produk,
        purchase_price: p.purchase_price !== undefined ? p.purchase_price : p.harga_beli,
        selling_price: p.selling_price !== undefined ? p.selling_price : p.harga_jual,
        stock: p.stock !== undefined ? p.stock : p.stok,
        category_id: p.category_id !== undefined ? p.category_id : p.kategori_id,
        image: p.image || p.foto || null,
      }));

      setProducts(mapped);
      
      // Simpan informasi pagination dari backend
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Gagal memuat produk dari database:", error);
    }
  };

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
      const result = await getCategory();
      const flatData = flattenCategories(result.data || result);
      setCategories(flatData);
    } catch (error) {
      console.error("Gagal memuat kategori dari database:", error);
    }
  };

  const getCategoryName = (catId) => {
    const found = categories.find((c) => String(c.id) === String(catId));
    return found ? found.nama_kategori : "-";
  };

  const level1Options = useMemo(
    () => categories.filter((c) => c.parent_id === null || c.parent_id === undefined),
    [categories]
  );

  const level2Options = useMemo(() => {
    if (!filterL1) return [];
    return categories.filter((c) => Number(c.parent_id) === Number(filterL1));
  }, [filterL1, categories]);

  const level3Options = useMemo(() => {
    if (!filterL2) return [];
    return categories.filter((c) => Number(c.parent_id) === Number(filterL2));
  }, [filterL2, categories]);

  // Catatan: Karena filter pencarian dan kategori kini sudah ditangani langsung di backend via API query,
  // data pada 'products' sudah terfilter otomatis oleh backend.
  
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      product_name: "",
      purchase_price: "",
      selling_price: "",
      stock: "",
      category_id: "",
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name,
      purchase_price: product.purchase_price,
      selling_price: product.selling_price,
      stock: product.stock,
      category_id: product.category_id || "",
      image: product.image || null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
      } else {
        await createProduct(formData);
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
      render: (_, index) => (page - 1) * limit + index + 1, // Nomor urut menyesuaikan halaman aktif
      className: "w-16 text-center",
      tdClassName: "text-center font-medium text-slate-500",
    },
    {
      header: "Foto",
      render: (row) =>
        row.image ? (
          <img
            src={`${API_URL}/uploads/${row.image}`}
            alt={row.product_name}
            className="h-10 w-10 rounded-lg object-cover border border-slate-200 shadow-sm"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400 font-medium">
            N/A
          </div>
        ),
      className: "w-20 text-center",
      tdClassName: "text-center",
    },
    { header: "Nama Produk", key: "product_name" },
    {
      header: "Kategori",
      render: (row) => getCategoryName(row.category_id),
    },
    {
      header: "Harga Beli",
      render: (row) => `Rp ${Number(row.purchase_price).toLocaleString("id-ID")}`,
    },
    {
      header: "Harga Jual",
      render: (row) => `Rp ${Number(row.selling_price).toLocaleString("id-ID")}`,
    },
    { header: "Stok", key: "stock" },
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
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset ke halaman 1 saat mengetik pencarian
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              {/* 4. Dropdown Sortir */}
      <select
  value={`${sort}-${order}`}
  onChange={(e) => {
    const [selectedSort, selectedOrder] = e.target.value.split("-");
    setSort(selectedSort);
    setOrder(selectedOrder);
    setPage(1);
  }}
  className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white"
>
  <option value="id-DESC">Terbaru</option>
  <option value="product_name-ASC">Nama (A-Z)</option>
  <option value="product_name-DESC">Nama (Z-A)</option>
  <option value="selling_price-ASC">Harga Termurah</option>
  <option value="selling_price-DESC">Harga Termahal</option>
</select>

              <select
                value={filterL1}
                onChange={(e) => {
                  setFilterL1(e.target.value);
                  setFilterL2("");
                  setFilterL3("");
                  setPage(1);
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

              {level2Options.length > 0 && (
                <select
                  value={filterL2}
                  onChange={(e) => {
                    setFilterL2(e.target.value);
                    setFilterL3("");
                    setPage(1);
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

              {level3Options.length > 0 && (
                <select
                  value={filterL3}
                  onChange={(e) => {
                    setFilterL3(e.target.value);
                    setPage(1);
                  }}
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

          {/* Tabel Produk (menggunakan 'products' langsung karena data sudah dipaginasi oleh backend) */}
          <Table
            columns={columns}
            rows={products}
            empty="Tidak ada produk yang ditemukan."
          />

          {/* 5. Bagian Informasi & Komponen Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-sm text-slate-500">
              Menampilkan {products.length} dari {pagination.totalItems} produk
            </p>
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!selectedProduct}
        categories={categories}
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