import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import { getCategory } from "../services/categoryService";
import { API_URL } from "../services/api";

export default function Product() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [filterL1, setFilterL1] = useState("");
  const [filterL2, setFilterL2] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("DESC");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    product_name: "",
    purchase_price: "",
    selling_price: "",
    stock: "",
    image: null,
    category_id: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const getAllChildCategoryIds = (parentId) => {
    const numericParentId = Number(parentId);
    let ids = [numericParentId];

    const children = categories.filter((c) => Number(c.parent_id) === numericParentId);
    children.forEach((child) => {
      ids = [...ids, ...getAllChildCategoryIds(child.id)];
    });

    return ids;
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts({
        limit: 1000,
      });

      let productList = response.data || [];
      
      let mapped = productList.map(p => ({
        id: p.id,
        product_name: p.product_name || p.nama_produk,
        purchase_price: p.purchase_price !== undefined ? p.purchase_price : p.harga_beli,
        selling_price: p.selling_price !== undefined ? p.selling_price : p.harga_jual,
        stock: p.stock !== undefined ? p.stock : p.stok,
        image: p.image || p.foto || null,
        category_id: p.category_id !== undefined ? p.category_id : p.kategori_id,
        sub_category_id: p.sub_category_id || null,
      }));

      setAllProducts(mapped);
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

  const getCategoryName = (row) => {
    const targetId = row.sub_category_id || row.category_id;
    const found = categories.find((c) => String(c.id) === String(targetId));
    if (!found) return "-";

    if (found.parent_id) {
      const parentFound = categories.find((c) => String(c.id) === String(found.parent_id));
      if (parentFound) {
        return `${parentFound.nama_kategori} > ${found.nama_kategori}`;
      }
    }

    return found.nama_kategori;
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (search) {
      result = result.filter((p) =>
        p.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterL2) {
      result = result.filter((p) => String(p.category_id) === String(filterL2));
    } else if (filterL1) {
      const validCategoryIds = getAllChildCategoryIds(filterL1).map((id) => String(id));
      result = result.filter((p) => validCategoryIds.includes(String(p.category_id)));
    }

    result.sort((a, b) => {
      if (sort === "product_name") {
        return order === "ASC"
          ? a.product_name.localeCompare(b.product_name)
          : b.product_name.localeCompare(a.product_name);
      }
      if (sort === "selling_price") {
        return order === "ASC"
          ? a.selling_price - b.selling_price
          : b.selling_price - a.selling_price;
      }
      return order === "ASC" ? a.id - b.id : b.id - a.id;
    });

    return result;
  }, [allProducts, search, filterL1, filterL2, sort, order, categories]);

  const totalPages = Math.ceil(filteredProducts.length / limit) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, page, limit]);

  const level1Options = useMemo(
    () => categories.filter((c) => c.parent_id === null || c.parent_id === undefined || c.parent_id === 0),
    [categories]
  );

  const level2Options = useMemo(() => {
    if (!filterL1) return [];
    return categories.filter((c) => Number(c.parent_id) === Number(filterL1));
  }, [filterL1, categories]);

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      product_name: "",
      purchase_price: "",
      selling_price: "",
      stock: "",
      image: null,
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
      image: product.image || null,
      category_id: product.category_id || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (formDataPayload) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formDataPayload);
      } else {
        await createProduct(formDataPayload);
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
      render: (_, index) => (page - 1) * limit + index + 1,
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
      render: (row) => {
        const targetId = row.sub_category_id || row.category_id;
        const found = categories.find((c) => String(c.id) === String(targetId));
        if (!found) return <span className="text-slate-400">-</span>;

        let parentName = "";
        let subName = "";

        if (found.parent_id) {
          const parentFound = categories.find((c) => String(c.id) === String(found.parent_id));
          if (parentFound) {
            parentName = parentFound.nama_kategori;
            subName = found.nama_kategori;
          }
        } else {
          parentName = found.nama_kategori;
        }

        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {parentName}
            </span>
            {subName && (
              <>
                <span className="text-slate-400 text-xs">/</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {subName}
                </span>
              </>
            )}
          </div>
        );
      },
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
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
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

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus size={18} />
                <span>Tambah Produk</span>
              </button>
            </div>
          </div>

          {/* TABEL DAN INFO/PAGINATION MENYATU DALAM SATU CONTAINER CARD */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table
              columns={columns}
              rows={paginatedProducts}
              empty="Tidak ada produk yang ditemukan."
            />

            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              <p className="text-sm text-slate-500">
                Menampilkan {paginatedProducts.length} dari {filteredProducts.length} produk
              </p>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
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