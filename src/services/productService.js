import api from "./api";

export const getProducts = async (categoryId = "") => {
  const url = categoryId ? `/products?category_id=${categoryId}` : "/products";
  const response = await api.get(url);
  return response.data.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};