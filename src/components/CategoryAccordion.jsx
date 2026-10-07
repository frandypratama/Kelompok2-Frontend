import React from "react";
import { Edit, Trash2, Plus } from "lucide-react";

export default function CategoryAccordion({ categories, onEdit, onDelete, onAddSub }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        Tidak ada kategori ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-200">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            style={{ paddingLeft: `${(cat.depth || 0) * 24 + 16}px` }}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-700">
                {cat.depth > 0 ? "📂 " : "📁 "} {cat.nama_kategori}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                Level {cat.level}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddSub(cat)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Tambah Subkategori"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => onEdit(cat)}
                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(cat.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}