export default function PosProductCard({ product, onAddToCart, availableStock, currentQty }) {
  const isOutOfStock = availableStock <= 0;

  return (
    <button
      type="button"
      onClick={() => onAddToCart(product)}
      disabled={isOutOfStock}
      className={`p-3 text-left bg-white rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
        isOutOfStock
          ? "opacity-50 border-slate-200 cursor-not-allowed bg-slate-50"
          : "border-slate-200 hover:border-blue-500 hover:shadow-md"
      }`}
    >
      <div>
        <p className="font-semibold text-slate-800 text-sm line-clamp-2">
          {product.nama_produk}
        </p>
        <p className="text-blue-600 font-bold text-sm mt-1">
          Rp {product.harga_jual.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-xs">
        <span
          className={`font-medium ${
            availableStock <= 3 ? "text-rose-500 font-bold" : "text-slate-500"
          }`}
        >
          {isOutOfStock ? "Habis" : `Stok: ${availableStock}`}
        </span>
        {currentQty > 0 && (
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
            {currentQty}x
          </span>
        )}
      </div>
    </button>
  );
}