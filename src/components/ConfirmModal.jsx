import { ShieldAlert } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Data Ini?",
  message = "Tindakan ini tidak dapat dibatalkan.",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-6 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{message}</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}