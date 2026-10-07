import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-xl text-blue-600">SPOtify</div>
      <div>
        {/* Tambahkan menu navbar Anda di sini */}
        <span className="text-gray-600 font-medium">Dashboard Konter</span>
      </div>
    </nav>
  );
}