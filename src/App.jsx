import { BrowserRouter, Routes, Route } from "react-router-dom"; // 👈 Tambahkan BrowserRouter
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}