import Modal from "./Modal";
import { Printer, ShoppingBag, CreditCard, Calendar, User } from "lucide-react";

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
  if (!transaction) return null;

  // Hitung kembalian secara aman jika pembayaran cash
  const changeAmount = transaction.paid_amount ? transaction.paid_amount - transaction.total_price : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detail Nota: ${transaction.invoice_no}`}>
      <div className="space-y-4 text-slate-700 text-xs">
        {/* Info Header */}
        <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-500">
              <Calendar size={13} />
              <span>Tanggal:</span>
            </div>
            <p className="font-semibold text-slate-800">
              {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString("id-ID") : "-"}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-500">
              <User size={13} />
              <span>Kasir:</span>
            </div>
            <p className="font-semibold text-slate-800">{transaction.user?.name || "Kasir"}</p>
          </div>
          <div className="space-y-1 col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-500">
              <CreditCard size={13} />
              <span>Pembayaran:</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
              {transaction.payment_method || "-"}
            </span>
          </div>
        </div>

        {/* Tabel List Item (transaction_details) */}
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-2">
            <ShoppingBag size={15} className="text-blue-600" />
            <span>Daftar Barang</span>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2">Produk</th>
                  <th className="p-2 text-center">Harga</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transaction.details?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {/* Mengambil nama produk dari hasil include Sequelize (item.product.product_name) */}
                    <td className="p-2 font-medium text-slate-800">
                      {item.product?.product_name || `Produk ID: ${item.product_id}`}
                    </td>
                    <td className="p-2 text-center">Rp {item.selling_price.toLocaleString("id-ID")}</td>
                    <td className="p-2 text-center font-bold">{item.quantity}</td>
                    <td className="p-2 text-right font-medium">
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rincian Pembayaran */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
          <div className="flex justify-between font-bold text-xs text-slate-900">
            <span>Total Belanja:</span>
            <span>Rp {transaction.total_price.toLocaleString("id-ID")}</span>
          </div>
          {transaction.payment_method === "cash" && (
            <>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Tunai Dibayar:</span>
                <span>Rp {transaction.paid_amount?.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Kembalian:</span>
                <span>Rp {changeAmount > 0 ? changeAmount.toLocaleString("id-ID") : 0}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak Struk</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}