import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Product from "./pages/Product";
import Category from "./pages/Category";
import HomePage from "./pages/homePage";
import Pos from "./pages/Pos";
import TransactionHistory from "./pages/TransactionHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user" element={<User />} />
      <Route path="/product" element={<Product />} />
      <Route path="/category" element={<Category />} />
      <Route path="/pos" element={<Pos />} />
      <Route path="/transactions" element={<TransactionHistory />} />
    </Routes>
  );
}

export default App;