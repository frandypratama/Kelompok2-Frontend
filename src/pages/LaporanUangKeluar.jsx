import { useCallback, useEffect, useState } from "react";
import {
  Printer,
  Plus,
  RefreshCw,
  RotateCcw,
  Wallet,
  ReceiptText,
  Layers3,
  X,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const tanggalHariIni = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

const formatTanggal = (value) => {
  if (!value) return "-";

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const formatTanggalPanjang = (value) => {
  if (!value) return "Semua tanggal";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
};

const formAwal = () => ({
  tanggal: tanggalHariIni(),
  kategori_id: "",
  nominal: "",
  metode_pembayaran: "tunai",
  keterangan: "",
});

export default function LaporanUangKeluar() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState([]);

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [kategoriId, setKategoriId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ringkasan, setRingkasan] = useState({
    jumlah_transaksi: 0,
    total_pengeluaran: 0,
    per_kategori: [],
  });

  const [modalTambah, setModalTambah] = useState(false);
  const [editId, setEditId] = useState(null);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesanForm, setPesanForm] = useState("");
  const [form, setForm] = useState(formAwal);
  const [namaKategori, setNamaKategori] = useState("");
  const [menyimpanKategori, setMenyimpanKategori] = useState(false);

  // STATE PAGINATION
  const [halamanAktif, setHalamanAktif] = useState(1);
  const [dataPerHalaman, setDataPerHalaman] = useState(10);

  const totalHalaman = Math.max(1, Math.ceil(data.length / dataPerHalaman));

  const indeksPertama = (halamanAktif - 1) * dataPerHalaman;
  const indeksTerakhir = Math.min(indeksPertama + dataPerHalaman, data.length);

  const dataHalaman = data.slice(indeksPertama, indeksTerakhir);

  // Mengambil kategori pengeluaran
  const ambilKategori = useCallback(async () => {
    try {
      const response = await api.get("/pengeluaran/kategori");

      const hasil = response.data?.data;

      setKategori(Array.isArray(hasil) ? hasil : []);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  }, []);

  // Mengambil laporan berdasarkan filter
  const ambilLaporan = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (tanggalMulai) {
        params.tanggal_mulai = tanggalMulai;
      }

      if (tanggalAkhir) {
        params.tanggal_akhir = tanggalAkhir;
      }

      if (kategoriId) {
        params.kategori_id = kategoriId;
      }

      const response = await api.get("/pengeluaran/laporan", {
        params,
      });

      const hasil = response.data || {};
      const daftarData = Array.isArray(hasil.data) ? hasil.data : [];

      setData(daftarData);

      setRingkasan({
        jumlah_transaksi: Number(hasil.jumlah_transaksi) || 0,
        total_pengeluaran: Number(hasil.total_pengeluaran) || 0,
        per_kategori: Array.isArray(hasil.per_kategori)
          ? hasil.per_kategori
          : [],
      });

      // Pastikan halaman aktif tetap valid setelah data berubah.
      const jumlahHalaman = Math.max(
        1,
        Math.ceil(daftarData.length / dataPerHalaman),
      );

      setHalamanAktif((halaman) => Math.min(halaman, jumlahHalaman));
    } catch (err) {
      console.error("Gagal mengambil laporan:", err);

      setError(
        err.response?.data?.message || "Gagal mengambil laporan pengeluaran.",
      );

      setData([]);

      setRingkasan({
        jumlah_transaksi: 0,
        total_pengeluaran: 0,
        per_kategori: [],
      });

      setHalamanAktif(1);
    } finally {
      setLoading(false);
    }
  }, [tanggalMulai, tanggalAkhir, kategoriId, dataPerHalaman]);

  useEffect(() => {
    ambilKategori();
  }, [ambilKategori]);

  useEffect(() => {
    ambilLaporan();
  }, [ambilLaporan]);

  // Reset ke halaman pertama saat filter atau jumlah data berubah.
  useEffect(() => {
    setHalamanAktif(1);
  }, [tanggalMulai, tanggalAkhir, kategoriId, dataPerHalaman]);

  const resetFilter = () => {
    setTanggalMulai("");
    setTanggalAkhir("");
    setKategoriId("");
    setHalamanAktif(1);
  };

  const bukaModal = () => {
    setPesanForm("");
    setEditId(null);
    setForm(formAwal());
    setNamaKategori("");
    setModalTambah(true);
  };

  // Membuka formulir edit
  const bukaEdit = (item) => {
    setPesanForm("");
    setEditId(item.id);

    setForm({
      tanggal: item.tanggal
        ? String(item.tanggal).slice(0, 10)
        : tanggalHariIni(),
      kategori_id: String(item.kategori_id || item.kategori?.id || ""),
      nominal: String(item.nominal ?? ""),
      metode_pembayaran: item.metode_pembayaran || "tunai",
      keterangan: item.keterangan || "",
    });

    setNamaKategori(item.kategori?.nama_kategori || "");
    setModalTambah(true);
  };

  // Menghapus pengeluaran
  const hapusPengeluaran = async (item) => {
    const yakin = window.confirm(
      `Hapus pengeluaran ${formatRupiah(item.nominal)} tanggal ${formatTanggal(item.tanggal)}? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!yakin) return;

    try {
      await api.delete(`/pengeluaran/${item.id}`);
      await ambilLaporan();
    } catch (err) {
      console.error("Gagal menghapus pengeluaran:", err);

      window.alert(
        err.response?.data?.message ||
          "Gagal menghapus pengeluaran. Periksa endpoint DELETE backend.",
      );
    }
  };

  // Mencari kategori yang sudah ada atau membuat kategori baru
  const cariAtauBuatKategori = async () => {
    const nama = namaKategori.trim();

    if (!nama) {
      throw new Error("Nama kategori pengeluaran wajib diisi.");
    }

    const kategoriLama = kategori.find(
      (item) =>
        String(item.nama_kategori || "")
          .trim()
          .toLowerCase() === nama.toLowerCase(),
    );

    if (kategoriLama) {
      return kategoriLama.id;
    }

    setMenyimpanKategori(true);

    try {
      const response = await api.post("/pengeluaran/kategori", {
        nama_kategori: nama,
      });

      let kategoriBaru =
        response.data?.data || response.data?.kategori || response.data;

      if (Array.isArray(kategoriBaru)) {
        kategoriBaru = kategoriBaru[0];
      }

      if (!kategoriBaru?.id) {
        const daftarResponse = await api.get("/pengeluaran/kategori");

        const daftar = Array.isArray(daftarResponse.data?.data)
          ? daftarResponse.data.data
          : Array.isArray(daftarResponse.data?.kategori)
            ? daftarResponse.data.kategori
            : [];

        setKategori(daftar);

        kategoriBaru = daftar.find(
          (item) =>
            String(item.nama_kategori || "")
              .trim()
              .toLowerCase() === nama.toLowerCase(),
        );
      } else {
        await ambilKategori();
      }

      if (!kategoriBaru?.id) {
        throw new Error(
          "Kategori belum dapat dipastikan tersimpan. Periksa respons API kategori.",
        );
      }

      return kategoriBaru.id;
    } finally {
      setMenyimpanKategori(false);
    }
  };

  // Menyimpan transaksi baru atau perubahan transaksi
  const handleSimpan = async (event) => {
    event.preventDefault();
    setPesanForm("");

    if (!namaKategori.trim()) {
      setPesanForm("Nama kategori pengeluaran wajib diisi.");
      return;
    }

    if (
      !form.nominal ||
      !Number.isFinite(Number(form.nominal)) ||
      Number(form.nominal) <= 0
    ) {
      setPesanForm("Nominal harus berupa angka lebih besar dari 0.");
      return;
    }

    if (!form.tanggal) {
      setPesanForm("Tanggal pengeluaran wajib diisi.");
      return;
    }

    setMenyimpan(true);

    try {
      const kategoriTerpilihId = await cariAtauBuatKategori();

      const payload = {
        tanggal: form.tanggal,
        kategori_id: Number(kategoriTerpilihId),
        nominal: Number(form.nominal),
        metode_pembayaran: form.metode_pembayaran,
        keterangan: form.keterangan.trim(),
      };

      if (editId !== null) {
        await api.put(`/pengeluaran/${editId}`, payload);
      } else {
        await api.post("/pengeluaran", payload);
      }

      setModalTambah(false);
      setEditId(null);
      setForm(formAwal());
      setNamaKategori("");
      setHalamanAktif(1);

      await ambilKategori();
      await ambilLaporan();
    } catch (err) {
      console.error("Gagal menyimpan pengeluaran:", err);

      setPesanForm(
        err.response?.data?.message ||
          err.message ||
          "Gagal menyimpan pengeluaran.",
      );
    } finally {
      setMenyimpan(false);
    }
  };

  // Tombol berpindah halaman
  const keHalaman = (nomor) => {
    const halaman = Math.max(1, Math.min(nomor, totalHalaman));

    setHalamanAktif(halaman);
  };

  // Nomor halaman yang ditampilkan
  const daftarHalaman = () => {
    const jumlahTombol = 5;
    let awal = Math.max(1, halamanAktif - 2);
    let akhir = Math.min(totalHalaman, awal + jumlahTombol - 1);

    awal = Math.max(1, akhir - jumlahTombol + 1);

    return Array.from({ length: akhir - awal + 1 }, (_, index) => awal + index);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased print:block print:min-h-0 print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="min-w-0 flex-1 p-4 md:p-8 print:w-full print:min-w-0 print:p-0">
        <div className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
          {/* KOP LAPORAN CETAK */}
          <header className="mb-5 hidden border-b-2 border-slate-700 pb-4 text-center print:block">
            <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
              POSify - Laporan Uang Keluar
            </h1>

            <p className="mt-2 text-sm text-slate-700">
              Periode: {formatTanggalPanjang(tanggalMulai)} s/d{" "}
              {formatTanggalPanjang(tanggalAkhir)}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              {kategoriId
                ? `Kategori: ${
                    kategori.find(
                      (item) => String(item.id) === String(kategoriId),
                    )?.nama_kategori || "Kategori terpilih"
                  }`
                : "Kategori: Semua kategori"}
              {" | "}Dicetak pada: {new Date().toLocaleString("id-ID")}
            </p>
          </header>

          {/* JUDUL DAN TOMBOL */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
            <div>
              <p className="text-sm font-medium text-blue-600">
                POSify / Laporan
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-800 md:text-3xl">
                Laporan Uang Keluar
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Pantau dan evaluasi seluruh pengeluaran konter Anda.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={bukaModal}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus size={17} />
                Tambah Pengeluaran
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
              >
                <Printer size={17} />
                Cetak Laporan
              </button>
            </div>
          </div>

          {/* FILTER LAPORAN */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <h2 className="font-bold text-slate-800">Filter Laporan</h2>

              <button
                type="button"
                onClick={resetFilter}
                className="flex items-center gap-1 self-start text-sm font-semibold text-blue-600"
              >
                <RotateCcw size={14} />
                Reset filter
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="tanggalMulai"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Tanggal Mulai
                </label>

                <input
                  id="tanggalMulai"
                  type="date"
                  value={tanggalMulai}
                  max={tanggalAkhir || undefined}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggalAkhir"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Tanggal Akhir
                </label>

                <input
                  id="tanggalAkhir"
                  type="date"
                  value={tanggalAkhir}
                  min={tanggalMulai || undefined}
                  onChange={(e) => setTanggalAkhir(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="kategoriFilter"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Kategori
                </label>

                <select
                  id="kategoriFilter"
                  value={kategoriId}
                  onChange={(e) => setKategoriId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Semua kategori</option>

                  {kategori.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* PESAN ERROR */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 print:hidden">
              {error}
            </div>
          )}

          {/* KARTU RINGKASAN */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
            <SummaryCard
              title="Total Uang Keluar"
              value={formatRupiah(ringkasan.total_pengeluaran)}
              note="Sesuai filter yang dipilih"
              icon={<Wallet size={21} />}
            />

            <SummaryCard
              title="Jumlah Transaksi"
              value={ringkasan.jumlah_transaksi}
              note="Transaksi pengeluaran"
              icon={<ReceiptText size={21} />}
            />

            <SummaryCard
              title="Kategori Pengeluaran"
              value={ringkasan.per_kategori.length}
              note="Kategori dengan transaksi pada filter ini"
              icon={<Layers3 size={21} />}
            />
          </section>

          {/* REKAP KATEGORI */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid print:shadow-none">
            <h2 className="mb-4 font-bold text-slate-800">
              Rekap per Kategori
            </h2>

            {ringkasan.per_kategori.length === 0 ? (
              <p className="text-sm text-slate-500">
                Belum ada data kategori untuk filter ini.
              </p>
            ) : (
              <div className="space-y-4">
                {ringkasan.per_kategori.map((item, index) => {
                  const total = Number(ringkasan.total_pengeluaran) || 0;
                  const nominal = Number(item.nominal) || 0;
                  const persen = total > 0 ? (nominal / total) * 100 : 0;

                  return (
                    <div key={item.nama_kategori || index}>
                      <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                        <span className="font-medium text-slate-700">
                          {item.nama_kategori}
                        </span>

                        <span className="font-semibold text-slate-800">
                          {formatRupiah(nominal)}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 print:border print:border-slate-300">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, persen))}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* TABEL RINCIAN */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:overflow-visible print:shadow-none">
            <div className="flex flex-col justify-between gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center print:hidden">
              <div>
                <h2 className="font-bold text-slate-800">
                  Rincian Pengeluaran
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Memuat data..."
                    : `${data.length} transaksi ditemukan`}
                </p>
              </div>

              <button
                type="button"
                onClick={ambilLaporan}
                disabled={loading}
                className="flex items-center gap-2 self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Muat Ulang
              </button>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500 print:hidden">
                <RefreshCw size={22} className="mx-auto mb-3 animate-spin" />
                Memuat data laporan...
              </div>
            ) : data.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Tidak ada pengeluaran pada filter yang dipilih.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto print:overflow-visible">
                  <table className="w-full min-w-[850px] table-auto text-left text-sm print:min-w-0 print:table-fixed print:text-xs">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 print:bg-slate-100">
                      <tr>
                        <th className="w-12 px-4 py-3">No.</th>
                        <th className="w-28 px-4 py-3">Tanggal</th>
                        <th className="w-36 px-4 py-3">Kategori</th>
                        <th className="px-4 py-3">Keterangan</th>
                        <th className="w-24 px-4 py-3">Metode</th>
                        <th className="w-36 px-4 py-3 text-right">Nominal</th>
                        <th className="w-36 px-4 py-3 text-center print:hidden">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {dataHalaman.map((item, index) => (
                        <tr
                          key={item.id ?? index}
                          className="print:break-inside-avoid"
                        >
                          <td className="px-4 py-3 text-slate-500">
                            {indeksPertama + index + 1}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {formatTanggal(item.tanggal)}
                          </td>

                          <td className="px-4 py-3">
                            <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 print:border print:border-slate-300 print:bg-white print:text-black">
                              {item.kategori?.nama_kategori || "-"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {item.keterangan || "-"}
                          </td>

                          <td className="px-4 py-3 capitalize text-slate-600">
                            {item.metode_pembayaran || "-"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-900">
                            {formatRupiah(item.nominal)}
                          </td>

                          <td className="px-4 py-3 print:hidden">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => bukaEdit(item)}
                                title="Edit pengeluaran"
                                aria-label={`Edit pengeluaran ${indeksPertama + index + 1}`}
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => hapusPengeluaran(item)}
                                title="Hapus pengeluaran"
                                aria-label={`Hapus pengeluaran ${indeksPertama + index + 1}`}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                              >
                                <Trash2 size={14} />
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot className="border-t-2 border-slate-200 bg-slate-50 print:bg-white">
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-right font-bold text-slate-800"
                        >
                          Total Pengeluaran
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-slate-900">
                          {formatRupiah(ringkasan.total_pengeluaran)}
                        </td>

                        <td className="print:hidden"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span>
                      Menampilkan {data.length > 0 ? indeksPertama + 1 : 0}
                      {"–"}
                      {indeksTerakhir} dari {data.length} transaksi
                    </span>

                    <select
                      value={dataPerHalaman}
                      onChange={(e) => {
                        setDataPerHalaman(Number(e.target.value));
                        setHalamanAktif(1);
                      }}
                      aria-label="Jumlah transaksi per halaman"
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5"
                    >
                      <option value={5}>5 data</option>
                      <option value={10}>10 data</option>
                      <option value={25}>25 data</option>
                      <option value={50}>50 data</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => keHalaman(halamanAktif - 1)}
                      disabled={halamanAktif === 1}
                      aria-label="Halaman sebelumnya"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                      <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    {daftarHalaman().map((nomor) => (
                      <button
                        key={nomor}
                        type="button"
                        onClick={() => keHalaman(nomor)}
                        aria-label={`Halaman ${nomor}`}
                        aria-current={
                          halamanAktif === nomor ? "page" : undefined
                        }
                        className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-semibold ${
                          halamanAktif === nomor
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {nomor}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => keHalaman(halamanAktif + 1)}
                      disabled={halamanAktif >= totalHalaman}
                      aria-label="Halaman berikutnya"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span className="hidden sm:inline">Berikutnya</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          <p className="hidden pt-4 text-center text-xs text-slate-500 print:block">
            Laporan ini dibuat oleh sistem POSify.
          </p>
        </div>

        {/* MODAL TAMBAH DAN EDIT */}
        {modalTambah && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 print:hidden"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && !menyimpan) {
                setModalTambah(false);
              }
            }}
          >
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {editId !== null
                      ? "Edit Pengeluaran"
                      : "Tambah Pengeluaran"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editId !== null
                      ? "Perbarui rincian uang keluar."
                      : "Masukkan rincian uang keluar."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => !menyimpan && setModalTambah(false)}
                  disabled={menyimpan}
                  aria-label="Tutup formulir"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {pesanForm && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                >
                  {pesanForm}
                </div>
              )}

              <form onSubmit={handleSimpan} className="space-y-4">
                <div>
                  <label
                    htmlFor="formTanggal"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Tanggal
                  </label>

                  <input
                    id="formTanggal"
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tanggal: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="formKategori"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Kategori Uang Keluar
                  </label>

                  <input
                    id="formKategori"
                    type="text"
                    list="daftarKategoriPengeluaran"
                    required
                    maxLength={100}
                    autoComplete="off"
                    value={namaKategori}
                    onChange={(e) => setNamaKategori(e.target.value)}
                    placeholder="Ketik atau pilih kategori..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <datalist id="daftarKategoriPengeluaran">
                    {kategori.map((item) => (
                      <option key={item.id} value={item.nama_kategori} />
                    ))}
                  </datalist>

                  <p className="mt-1 text-xs text-slate-500">
                    Pilih kategori yang tersedia atau ketik kategori baru.
                    Kategori baru disimpan saat pengeluaran disimpan.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="formNominal"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Nominal (Rp)
                  </label>

                  <input
                    id="formNominal"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.nominal}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nominal: e.target.value,
                      })
                    }
                    placeholder="Contoh: 25000"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="formMetode"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Metode Pembayaran
                  </label>

                  <select
                    id="formMetode"
                    value={form.metode_pembayaran}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        metode_pembayaran: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                  >
                    <option value="tunai">Tunai</option>
                    <option value="transfer">Transfer</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="formKeterangan"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Keterangan
                  </label>

                  <textarea
                    id="formKeterangan"
                    rows={3}
                    value={form.keterangan}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        keterangan: e.target.value,
                      })
                    }
                    placeholder="Contoh: Pembelian perlengkapan konter"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalTambah(false)}
                    disabled={menyimpan}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={menyimpan || menyimpanKategori}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {menyimpan || menyimpanKategori
                      ? "Menyimpan..."
                      : editId !== null
                        ? "Simpan Perubahan"
                        : "Simpan Pengeluaran"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ title, value, note, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid print:shadow-none">
      <div className="mb-3 flex items-center justify-between print:hidden">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">{icon}</div>
      </div>

      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h3 className="mt-2 break-words text-xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-2 text-xs text-slate-400 print:hidden">{note}</p>
    </div>
  );
}
