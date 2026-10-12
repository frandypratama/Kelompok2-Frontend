import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import { getCategory } from "../services/categoryService";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State kategori murni dari database
  const [search, setSearch] = useState("");

  const [filterL1, setFilterL1] = useState("");
  const [filterL2, setFilterL2] = useState("");
  const [filterL3, setFilterL3] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    purchase_price: "",
    selling_price: "",
    stock: "",
    category_id: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const prodRes = await getProducts();
      const productList = Array.isArray(prodRes) 
        ? prodRes 
        : (Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []));
      
      const mapped = productList.map(p => ({
        id: p.id,
        product_name: p.product_name || p.nama_produk,
        purchase_price: p.purchase_price !== undefined ? p.purchase_price : p.harga_beli,
        selling_price: p.selling_price !== undefined ? p.selling_price : p.harga_jual,
        stock: p.stock !== undefined ? p.stock : p.stok,
        category_id: p.category_id !== undefined ? p.category_id : p.kategori_id,
      }));

      setProducts(mapped);
    } catch (error) {
      console.error("Gagal memuat produk dari database:", error);
    }
  };

  // Helper untuk meratakan struktur kategori bertingkat dari backend
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

  const getAllChildCategoryIds = (parentId) => {
    let ids = [Number(parentId)];
    const children = categories.filter((c) => c.parent_id === Number(parentId));
    children.forEach((child) => {
      ids = [...ids, ...getAllChildCategoryIds(child.id)];
    });
    return ids;
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

  const filteredProducts = products.filter((p) => {
    const matchSearch = (p.product_name || "").toLowerCase().includes(search.toLowerCase());

    let targetCatId = filterL3 || filterL2 || filterL1;
    let matchCategory = true;

    if (targetCatId) {
      const allowedIds = getAllChildCategoryIds(targetCatId);
      matchCategory = allowedIds.includes(Number(p.category_id));
    }

    return matchSearch && matchCategory;
  });

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      product_name: "",
      purchase_price: "",
      selling_price: "",
      stock: "",
      category_id: "",
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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
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