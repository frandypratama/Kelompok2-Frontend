import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const API_PENGELUARAN = `${API_URL}/api/pengeluaran`;
const API_KATEGORI = `${API_URL}/api/pengeluaran/kategori`;

const formatRupiah = (nilai) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(nilai) || 0);

const tanggalHariIni = () => {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const tanggal = String(sekarang.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${tanggal}`;
};

const FORM_KOSONG = {
  tanggal: tanggalHariIni(),
  kategori_id: "",
  nominal: "",
  metode_pembayaran: "tunai",
  keterangan: "",
};

async function requestAPI(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request gagal (${response.status})`
    );
  }

  return data;
}

export default function Pengeluaran() {
  const [pengeluaran, setPengeluaran] = useState([]);
  const [kategori, setKategori] = useState([]);

  const [form, setForm] = useState({
    ...FORM_KOSONG,
    tanggal: tanggalHariIni(),
  });

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);

  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  // Memuat kategori pengeluaran
  const muatKategori = useCallback(async () => {
    const hasil = await requestAPI(API_KATEGORI);

    setKategori(Array.isArray(hasil.data) ? hasil.data : []);
  }, []);

  // Memuat transaksi pengeluaran
  const muatPengeluaran = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (tanggalMulai) {
        params.set("tanggal_mulai", tanggalMulai);
      }

      if (tanggalAkhir) {
        params.set("tanggal_akhir", tanggalAkhir);
      }

      const query = params.toString();

      const url = query
        ? `${API_PENGELUARAN}?${query}`
        : API_PENGELUARAN;

      const hasil = await requestAPI(url);

      setPengeluaran(
        Array.isArray(hasil.data) ? hasil.data : []
      );
    } catch (err) {
      setError(
        err.message || "Gagal mengambil data pengeluaran."
      );
    } finally {
      setLoading(false);
    }
  }, [tanggalMulai, tanggalAkhir]);

  useEffect(() => {
    muatKategori().catch((err) => {
      setError(`Gagal memuat kategori: ${err.message}`);
    });
  }, [muatKategori]);

  useEffect(() => {
    muatPengeluaran();
  }, [muatPengeluaran]);

  // Menghitung total pengeluaran
  const totalPengeluaran = useMemo(
    () =>
      pengeluaran.reduce(
        (total, item) =>
          total + (Number(item.nominal) || 0),
        0
      ),
    [pengeluaran]
  );

  // Membuka form tambah
  const bukaTambah = () => {
    setForm({
      ...FORM_KOSONG,
      tanggal: tanggalHariIni(),
    });

    setError("");
    setSukses("");
    setModalTerbuka(true);
  };

  // Menutup form
  const tutupModal = () => {
    if (menyimpan) return;

    setModalTerbuka(false);

    setForm({
      ...FORM_KOSONG,
      tanggal: tanggalHariIni(),
    });
  };

  // Mengubah nilai form
  const ubahForm = (event) => {
    const { name, value } = event.target;

    setForm((sebelumnya) => ({
      ...sebelumnya,
      [name]: value,
    }));
  };

  // Menyimpan transaksi baru
  const simpanPengeluaran = async (event) => {
    event.preventDefault();

    setError("");
    setSukses("");

    if (
      !form.tanggal ||
      !form.kategori_id ||
      !form.nominal
    ) {
      setError(
        "Tanggal, kategori, dan nominal wajib diisi."
      );
      return;
    }

    if (
      tanggalMulai &&
      tanggalAkhir &&
      tanggalMulai > tanggalAkhir
    ) {
      setError(
        "Tanggal mulai tidak boleh melebihi tanggal akhir."
      );
      return;
    }

    if (
      !Number.isFinite(Number(form.nominal)) ||
      Number(form.nominal) <= 0
    ) {
      setError("Nominal harus lebih besar dari nol.");
      return;
    }

    const payload = {
      tanggal: form.tanggal,
      kategori_id: Number(form.kategori_id),
      nominal: Number(form.nominal),
      metode_pembayaran: form.metode_pembayaran,
      keterangan: form.keterangan.trim() || null,
    };

    setMenyimpan(true);

    try {
      await requestAPI(API_PENGELUARAN, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setModalTerbuka(false);
      setForm({
        ...FORM_KOSONG,
        tanggal: tanggalHariIni(),
      });

      setSukses("Pengeluaran berhasil ditambahkan.");

      await muatPengeluaran();
    } catch (err) {
      setError(
        err.message || "Gagal menyimpan pengeluaran."
      );
    } finally {
      setMenyimpan(false);
    }
  };

  // Reset filter tanggal
  const resetFilter = () => {
    setTanggalMulai("");
    setTanggalAkhir("");
  };

  const kelasInput =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar POSify */}
      <Sidebar />

      {/* Konten utama */}
      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                KEUANGAN / UANG KELUAR
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Pengeluaran
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Kelola dan pantau pengeluaran operasional toko Anda.
              </p>
            </div>

            <button
              type="button"
              onClick={bukaTambah}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-lg">+</span>
              Tambah Pengeluaran
            </button>
          </div>

          {/* Notifikasi error */}
          {error && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Tutup pesan error"
                className="font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Notifikasi sukses */}
          {sukses && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              <span>{sukses}</span>

              <button
                type="button"
                onClick={() => setSukses("")}
                aria-label="Tutup pesan sukses"
                className="font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Ringkasan */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Pengeluaran
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatRupiah(totalPengeluaran)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Berdasarkan transaksi yang ditampilkan
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Jumlah Transaksi
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {pengeluaran.length}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Sesuai filter tanggal saat ini
              </p>
            </div>
          </section>

          {/* Filter tanggal */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Filter Pengeluaran
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pilih rentang tanggal untuk menyaring transaksi.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
              <label className="block text-sm font-medium text-slate-700">
                Tanggal Mulai

                <input
                  type="date"
                  value={tanggalMulai}
                  max={tanggalAkhir || undefined}
                  onChange={(event) =>
                    setTanggalMulai(event.target.value)
                  }
                  className={kelasInput}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Tanggal Akhir

                <input
                  type="date"
                  value={tanggalAkhir}
                  min={tanggalMulai || undefined}
                  onChange={(event) =>
                    setTanggalAkhir(event.target.value)
                  }
                  className={kelasInput}
                />
              </label>

              <button
                type="button"
                onClick={muatPengeluaran}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Terapkan Filter
              </button>

              <button
                type="button"
                onClick={resetFilter}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </section>

          {/* Tabel transaksi */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Daftar Transaksi Pengeluaran
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Data diambil dari database POSify.
                </p>
              </div>

              <button
                type="button"
                onClick={muatPengeluaran}
                disabled={loading}
                className="self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {loading ? "Memuat..." : "↻ Muat Ulang"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Tanggal
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Kategori
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Keterangan
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Pembayaran
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Nominal
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        Memuat data pengeluaran...
                      </td>
                    </tr>
                  ) : pengeluaran.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-12 text-center"
                      >
                        <p className="font-medium text-slate-700">
                          Belum ada transaksi pengeluaran
                        </p>

                        <p className="mt-1 text-slate-500">
                          Tambahkan transaksi atau ubah filter tanggal.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    pengeluaran.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {item.tanggal}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {item.kategori?.nama_kategori ||
                              kategori.find(
                                (k) =>
                                  Number(k.id) ===
                                  Number(item.kategori_id)
                              )?.nama_kategori ||
                              "Tanpa kategori"}
                          </span>
                        </td>

                        <td className="max-w-xs px-5 py-4 text-slate-600">
                          <span className="block truncate">
                            {item.keterangan || "-"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 capitalize text-slate-600">
                          {item.metode_pembayaran || "-"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-red-600">
                          {formatRupiah(item.nominal)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              Menampilkan{" "}
              <span className="font-semibold text-slate-900">
                {pengeluaran.length}
              </span>{" "}
              transaksi
            </div>
          </section>
        </div>
      </main>

      {/* Modal tambah pengeluaran */}
      {modalTerbuka && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              tutupModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-modal-pengeluaran"
            className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <h2
                  id="judul-modal-pengeluaran"
                  className="text-xl font-bold text-slate-900"
                >
                  Tambah Pengeluaran
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi informasi transaksi uang keluar.
                </p>
              </div>

              <button
                type="button"
                onClick={tutupModal}
                disabled={menyimpan}
                aria-label="Tutup formulir"
                className="rounded-lg px-3 py-1 text-2xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={simpanPengeluaran}
              className="space-y-4 p-5"
            >
              <label className="block text-sm font-medium text-slate-700">
                Tanggal *

                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={ubahForm}
                  required
                  className={kelasInput}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Kategori Pengeluaran *

                <select
                  name="kategori_id"
                  value={form.kategori_id}
                  onChange={ubahForm}
                  required
                  className={kelasInput}
                >
                  <option value="">Pilih kategori</option>

                  {kategori.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_kategori}
                    </option>
                  ))}
                </select>

                {kategori.length === 0 && (
                  <span className="mt-1 block text-xs text-amber-700">
                    Belum ada kategori. Pastikan API kategori tersedia.
                  </span>
                )}
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Nominal (Rp) *

                <input
                  type="number"
                  name="nominal"
                  value={form.nominal}
                  onChange={ubahForm}
                  min="1"
                  step="1"
                  placeholder="Contoh: 500000"
                  required
                  className={kelasInput}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Metode Pembayaran *

                <select
                  name="metode_pembayaran"
                  value={form.metode_pembayaran}
                  onChange={ubahForm}
                  required
                  className={kelasInput}
                >
                  <option value="tunai">Tunai</option>
                  <option value="transfer">Transfer</option>
                  <option value="qris">QRIS</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Keterangan

                <textarea
                  name="keterangan"
                  value={form.keterangan}
                  onChange={ubahForm}
                  rows="3"
                  placeholder="Contoh: Pembelian stok kartu perdana"
                  className={kelasInput}
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={tutupModal}
                  disabled={menyimpan}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={menyimpan || kategori.length === 0}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {menyimpan
                    ? "Menyimpan..."
                    : "Simpan Pengeluaran"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}