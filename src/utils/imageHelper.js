export const getProductImage = (row, categories = []) => {
  // 1. Jika produk memiliki gambar khusus yang di-upload satuan (seperti Rokok, Sembako tertentu, dll)
  if (row.image) {
    return `http://localhost:3000/uploads/${row.image}`;
  }

  // 2. Cari data kategori produk berdasarkan category_id
  const found = categories.find((c) => String(c.id) === String(row.category_id));
  const categoryName = found ? found.nama_kategori.toLowerCase() : "";
  const productName = (row.product_name || "").toLowerCase();

  // 3. Logika khusus untuk VOUCHER & KARTU PRABAYAR berdasarkan operator (Telkomsel, Tri, Axis)
  // Cek berdasarkan nama kategori atau teks pada nama produk
  if (
    categoryName.includes("telkomsel") || 
    productName.includes("telkomsel")
  ) {
    return "http://localhost:3000/uploads/telkomsel.jpg"; // Sesuaikan ekstensi .jpg / .png / .webp
  } 
  
  if (
    categoryName.includes("tri") || 
    categoryName.includes("3") || 
    productName.includes("tri") || 
    productName.includes(" 3 ")
  ) {
    return "http://localhost:3000/uploads/tri.jpg";
  } 
  
  if (
    categoryName.includes("axis") || 
    productName.includes("axis")
  ) {
    return "http://localhost:3000/uploads/axis.jpg";
  }

  // 4. Untuk produk lain (Sembako, Non-Sembako, Aksesoris) jika tidak mengupload gambar, gunakan default
  return "http://localhost:3000/uploads/default-product.png";
};
