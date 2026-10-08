import { Plus, Minus, Trash2 } from "lucide-react";

export default function PosCartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="py-3 flex justify-between items-center">
      <div className="min-w-0 flex-1 pr-2">
        <p className="text-sm font-medium text-slate-800 truncate">
          {item.nama_produk}
        </p>
        <p className="text-xs text-slate-500">
          Rp {item.harga_jual.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onUpdateQty(item.id, -1)}
          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <Minus size={14} />
        </button>
        <span className="text-sm font-semibold w-6 text-center">
          {item.qty}
        </span>
        <button
          type="button"
          onClick={() => onUpdateQty(item.id, 1)}
          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}