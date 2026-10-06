import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, Pencil, Trash2, Plus } from "lucide-react";

export default function CategoryAccordion({ categories, onEdit, onDelete, onAddSub }) {
  // State menyimpan ID kategori yang sedang terbuka
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter kategori utama (Level 1)
  const level1Categories = categories.filter((c) => c.parent_id === null);

  // Helper render turunan secara rekursif
  const renderCategoryNode = (category, level = 1) => {
    const children = categories.filter((c) => c.parent_id === category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.includes(category.id);

    const levelBadges = {
      1: "bg-blue-50 text-blue-700 border-blue-200",
      2: "bg-amber-50 text-amber-700 border-amber-200",
      3: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
      <div key={category.id} className="w-full">
        <div
          className={`flex items-center justify-between p-3 border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
            level === 1 ? "bg-white" : level === 2 ? "bg-slate-50/50 pl-8" : "bg-slate-100/40 pl-14"
          }`}
        >
          {/* Sisi Kiri: Ikon Panah, Folders, & Nama */}
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
              >
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            ) : (
              <span className="w-6" /> // Spacer jika tidak punya anak
            )}

            {isExpanded ? (
              <FolderOpen size={18} className="text-blue-500 shrink-0" />
            ) : (
              <Folder size={18} className="text-slate-400 shrink-0" />
            )}

            <span className={`text-sm font-medium ${level === 1 ? "text-slate-800 font-semibold" : "text-slate-700"}`}>
              {category.nama_kategori}
            </span>

            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${levelBadges[level]}`}>
              Lvl {level}
            </span>
          </div>

          {/* Sisi Kanan: Aksi */}
          <div className="flex items-center gap-1">
            {level < 3 && (
              <button
                onClick={() => onAddSub(category)}
                title="Tambah Sub-Kategori"
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            )}
            <button
              onClick={() => onEdit(category)}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Anak dari kategori (Accordion Item) */}
        {hasChildren && isExpanded && (
          <div className="w-full">
            {children.map((child) => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
      {level1Categories.length > 0 ? (
        level1Categories.map((cat) => renderCategoryNode(cat, 1))
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">
          Tidak ada kategori ditemukan.
        </div>
      )}
    </div>
  );
}