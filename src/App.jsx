import { BrowserRouter, Routes, Route } from "react-router-dom"; // 👈 Tambahkan BrowserRouter
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Product from "./pages/Product";
import Category from "./pages/Category";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<User />} />
        <Route path="/product" element={<Product />} />
        <Route path="/category" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
}