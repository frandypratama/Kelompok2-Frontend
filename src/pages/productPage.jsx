import React, { useState } from 'react';
import Navbar from '../components/navbar';

export default function ProductPage() {
    // Data dummy sementara berdasarkan database db_konter Anda agar langsung tampil
    const [products] = useState([
        { id: 'DAT-TSK-001', nama_produk: 'Telkomsel Paket Data 1 Hari 1.5 GB', harga_jual: 7000, stok: 50, kategori_id: 11 },
        { id: 'DAT-TRI-001', nama_produk: 'Tri AON / Data 1 Hari 2 GB', harga_jual: 6500, stok: 50, kategori_id: 12 },
        { id: 'PLS-TSK-010', nama_produk: 'Pulsa Telkomsel 10.000', harga_jual: 12000, stok: 999, kategori_id: 19 },
        { id: 'PLN-TKN-020', nama_produk: 'Token Listrik PLN 20.000', harga_jual: 22000, stok: 999, kategori_id: 22 },
        { id: 'GM-FF-005', nama_produk: 'Free Fire 5 Diamonds', harga_jual: 1500, stok: 999, kategori_id: 26 },
        { id: 'GM-ML-011', nama_produk: 'Mobile Legends 11 Diamonds', harga_jual: 5000, stok: 999, kategori_id: 27 },
    ]);
    
    const [searchTerm, setSearchTerm] = useState('');

    // Filter pencarian produk
    const filteredProducts = products.filter((item) =>
        item.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Daftar Produk Konter</h1>
                    
                    <input
                        type="text"
                        placeholder="Cari produk (misal: Telkomsel, Token, DANA)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((produk) => (
                            <div key={produk.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {produk.id}
                                    </span>
                                    <h3 className="font-bold text-gray-800 mt-3 text-base line-clamp-2">
                                        {produk.nama_produk}
                                    </h3>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="text-lg font-bold text-emerald-600">
                                        Rp {produk.harga_jual.toLocaleString('id-ID')}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3">Stok: {produk.stok}</div>
                                    <button
                                        onClick={() => alert(`Produk ${produk.nama_produk} dipilih!`)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                                    >
                                        Beli / Pilih
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            Produk tidak ditemukan.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}