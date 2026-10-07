import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import ProductPage from './pages/productPage'; // Pastikan penamaan huruf besar/kecil file sesuai (productPage.jsx)

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product" element={<ProductPage />} />
    </Routes>
  );
}

export default App;