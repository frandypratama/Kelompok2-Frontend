import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PosProductCard from "../components/PosProductCard";
import PosCartItem from "../components/PosCartItem";
import InvoiceModal from "../components/InvoiceModal";
import { Search, ShoppingCart, CreditCard, Banknote, QrCode, ArrowLeftRight } from "lucide-react";
import { getProducts } from "../services/productService";
import { getCategory } from "../services/categoryService";

export default function Pos() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // Cascading Category Filter
  const [filterL1, setFilterL1] = useState("");
  const [filterL2, setFilterL2] = useState("");
  const [filterL3, setFilterL3] = useState("");

  // Cart & Payment States
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash' | 'transfer' | 'qris'
  const [bayar, setBayar] = useState("");

  // Modal State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([getProducts(), getCategory()]);

        if (!isMounted) return;

        // 1. Processing Products Data
        const productList = Array.isArray(prodRes)
          ? prodRes
          : Array.isArray(prodRes.data)
          ? prodRes.data
          : prodRes.data?.data || [];

        const mappedProducts = productList.map((p) => ({
          id: p.id,
          nama_produk: p.product_name || p.nama_produk,
          harga_jual: Number(p.selling_price !== undefined ? p.selling_price : p.harga_jual),
          stok: Number(p.stock !== undefined ? p.stock : p.stok),
          kategori_id: p.category_id !== undefined ? p.category_id : p.kategori_id,
        }));
        setProducts(mappedProducts);

        // 2. Processing Nested Categories Data (Flatten Tree)
        const rawCategoryData = Array.isArray(catRes)
          ? catRes
          : Array.isArray(catRes.data)
          ? catRes.data
          : catRes.data?.data || [];

        const flattenedCategories = [];

        // Helper rekursif untuk membongkar subcategories bersarang dari API
        const extractCategories = (items, defaultParentId = null) => {
          if (!Array.isArray(items)) return;

          items.forEach((item) => {
            const currentParentId =
              item.parent_id !== undefined && item.parent_id !== null
                ? item.parent_id && Number(item.parent_id) !== 0
                  ? Number(item.parent_id)
                  : null
                : defaultParentId;

            flattenedCategories.push({
              id: Number(item.id),
              nama_kategori: item.category_name || item.nama_kategori || item.name || "Tanpa Nama",
              parent_id: currentParentId,
            });

            // Jika item punya anak subcategories, ekstraksi juga secara rekursif
            if (item.subcategories && Array.isArray(item.subcategories) && item.subcategories.length > 0) {
              extractCategories(item.subcategories, Number(item.id));
            }
          });
        };

        extractCategories(rawCategoryData);
        setCategories(flattenedCategories);
      } catch (err) {
        console.error("Gagal memuat data POS:", err);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper Filter Rekursif Anak Kategori (Mengembalikan ID sendiri & seluruh ID anak/cucu)
  const getAllChildCategoryIds = (parentId) => {
    const numericParentId = Number(parentId);
    let ids = [numericParentId];

    const children = categories.filter((c) => Number(c.parent_id) === numericParentId);
    children.forEach((child) => {
      ids = [...ids, ...getAllChildCategoryIds(child.id)];
    });

    return ids;
  };

  const level1Options = useMemo(
    () => categories.filter((c) => c.parent_id === null || c.parent_id === 0),
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
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    let targetCatId = filterL3 || filterL2 || filterL1;
    let matchCategory = true;

    if (targetCatId) {
      const allowedIds = getAllChildCategoryIds(targetCatId);
      matchCategory = allowedIds.includes(Number(p.kategori_id));
    }

    return matchSearch && matchCategory;
  });

  // Cart Operations
  const handleAddToCart = (product) => {
    const itemInCart = cart.find((i) => i.id === product.id);
    const currentQty = itemInCart ? itemInCart.qty : 0;

    if (product.stok - currentQty <= 0) return;

    setCart((prevCart) => {
      if (itemInCart) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            if (newQty > item.stok) return item;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalHarga = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.harga_jual * item.qty, 0);
  }, [cart]);

  const nominalBayar = paymentMethod === "cash" ? Number(bayar) || 0 : totalHarga;
  const kembali = paymentMethod === "cash" ? nominalBayar - totalHarga : 0;

  const isPaymentValid =
    cart.length > 0 &&
    (paymentMethod !== "cash" || (paymentMethod === "cash" && nominalBayar >= totalHarga));

  const handleCheckout = () => {
    if (!isPaymentValid) return;

    const transactionPayload = {
      invoice_no: `TRX-${Date.now().toString().slice(-6)}`,
      total_price: totalHarga,
      payment: paymentMethod, // 'cash' | 'transfer' | 'qris'
      bayar: nominalBayar,
      kembali: kembali,
      items: [...cart],
      tanggal: new Date().toLocaleString("id-ID"),
    };

    setLastTransaction(transactionPayload);

    // Simulasi pemotongan stok lokal
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) {
          return { ...p, stok: p.stok - cartItem.qty };
        }
        return p;
      })
    );

    setIsReceiptOpen(true);
    setCart([]);
    setBayar("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar title="Point of Sale (Kasir)" />

        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KATALOG PRODUK (7 Kolom) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filterL1}
                  onChange={(e) => {
                    setFilterL1(e.target.value);
                    setFilterL2("");
                    setFilterL3("");
                  }}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
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
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
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
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="">Semua Sub-Sub-Kategori</option>
                    {level3Options.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama_kategori}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const itemInCart = cart.find((i) => i.id === product.id);
                  const currentQty = itemInCart ? itemInCart.qty : 0;
                  const availableStock = product.stok - currentQty;

                  return (
                    <PosProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      availableStock={availableStock}
                      currentQty={currentQty}
                    />
                  );
                })
              ) : (
                <div className="col-span-full bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
                  Tidak ada produk ditemukan.
                </div>
              )}
            </div>
          </div>

          {/* KERANJANG & PEMBAYARAN (5 Kolom) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 h-fit">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-800">Keranjang Belanja</h2>
                </div>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-xs text-rose-600 hover:underline cursor-pointer font-medium"
                  >
                    Bersihkan
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-[260px] overflow-y-auto my-2 pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    <p>Keranjang masih kosong.</p>
                    <p className="text-xs text-slate-300 mt-1">Klik produk di samping untuk menambahkan.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <PosCartItem
                      key={item.id}
                      item={item}
                      onUpdateQty={handleUpdateQty}
                      onRemove={handleRemoveFromCart}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center text-slate-600 text-sm">
                <span>Total Belanja:</span>
                <span className="text-xl font-bold text-slate-900">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>

              {/* METODE PEMBAYARAN */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "cash"
                        ? "bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Banknote size={15} />
                    <span>Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("transfer")}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "transfer"
                        ? "bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ArrowLeftRight size={15} />
                    <span>Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qris")}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "qris"
                        ? "bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <QrCode size={15} />
                    <span>QRIS</span>
                  </button>
                </div>
              </div>

              {/* INPUT NOMINAL TUNAI (Hanya jika memilih CASH) */}
              {paymentMethod === "cash" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Nominal Uang Tunai (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={bayar}
                      onChange={(e) => setBayar(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[totalHarga, 50000, 100000].map((amt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBayar(String(amt))}
                        disabled={totalHarga === 0}
                        className="py-1.5 text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        {amt === totalHarga && amt > 0
                          ? "Uang Pas"
                          : `Rp ${(amt / 1000).toLocaleString("id-ID")}k`}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-500">Kembalian:</span>
                    <span
                      className={`font-bold text-sm ${
                        kembali < 0 ? "text-rose-500" : "text-emerald-600"
                      }`}
                    >
                      Rp {kembali > 0 ? kembali.toLocaleString("id-ID") : 0}
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
                  Pembayaran non-tunai ({paymentMethod.toUpperCase()}) akan diproses senilai{" "}
                  <span className="font-bold text-slate-800">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={!isPaymentValid}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 text-white transition-all cursor-pointer ${
                  !isPaymentValid
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md"
                }`}
              >
                <CreditCard size={18} />
                <span>Bayar & Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <InvoiceModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transactionData={lastTransaction}
      />
    </div>
  );
}