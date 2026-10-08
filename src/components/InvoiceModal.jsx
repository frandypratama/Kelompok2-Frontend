import Modal from "./Modal";
import { CheckCircle, Printer } from "lucide-react";

export default function InvoiceModal({ isOpen, onClose, transactionData }) {
  if (!transactionData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaksi Berhasil!">
      <div className="space-y-4 text-slate-700">
        <div className="text-center py-1">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-1" />
          <p className="text-xs text-slate-400">No. Faktur: {transactionData.invoice_no}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-2">
          <div className="text-center border-b border-dashed border-slate-300 pb-2">
            <p className="font-bold text-sm text-slate-800">POSIFY KONTER</p>
            <p className="text-[10px] text-slate-400">{transactionData.tanggal}</p>
          </div>

          <div className="space-y-1.5 py-2 border-b border-dashed border-slate-300">
            {transactionData.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <p className="font-medium text-slate-800">{item.nama_produk}</p>
                  <p className="text-[10px] text-slate-400">
                    {item.qty} x Rp {item.harga_jual.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="font-medium text-slate-800">
                  Rp {(item.harga_jual * item.qty).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between font-bold text-slate-900 text-sm">
              <span>Total:</span>
              <span>Rp {transactionData.total_price.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-slate-600 capitalize">
              <span>Metode Pembayaran:</span>
              <span className="font-semibold text-slate-800">{transactionData.payment.toUpperCase()}</span>
            </div>
            {transactionData.payment === "cash" && (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>Bayar:</span>
                  <span>Rp {transactionData.bayar.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Kembali:</span>
                  <span>Rp {transactionData.kembali.toLocaleString("id-ID")}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            <Printer size={16} />
            <span>Cetak Struk</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </Modal>
  );
}