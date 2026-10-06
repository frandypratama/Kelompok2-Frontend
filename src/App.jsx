import { BrowserRouter, Routes, Route } from "react-router-dom"; // 👈 Tambahkan BrowserRouter
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}