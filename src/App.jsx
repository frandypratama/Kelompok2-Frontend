import React from 'react';
import Navbar from './components/navbar';
import HomePage from './pages/homePage';

export default function App() {
  return (
    <div>
      {/* Memuat Navbar di atas */}
      <Navbar />
      
      {/* Memuat Halaman Utama */}
      <HomePage />
    </div>
  );
}