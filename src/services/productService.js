import api from "./api";

// Ambil semua produk atau filter berdasarkan kategori
export const getProducts = async (categoryId = "") => {
  const url = categoryId
    ? `/products?category_id=${categoryId}`
    : "/products";

  const response = await api.get(url);

  return response.data.data;
};

// Ambil produk berdasarkan ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data.data;
};

// Tambah produk (mendukung FormData / file)
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Edit produk (mendukung FormData / file)
export const updateProduct = async (id, productData) => {
  const response = await api.put(
    `/products/${id}`,
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Hapus produk
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};