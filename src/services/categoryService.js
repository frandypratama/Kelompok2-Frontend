import api from "./api";

// Mengambil semua kategori
export async function getCategory() {
const response = await api.get("/categories");
return response.data;
}

// Mengambil kategori berdasarkan ID
export async function getCategoryById(id) {
const response = await api.get(`/categories/${id}`);
return response.data;
}

// Menambahkan kategori
export async function createCategory(data) {
const response = await api.post("/categories", data);
return response.data;
}

// Mengubah kategori
export async function updateCategory(id, data) {
const response = await api.put(`/categories/${id}`, data);
return response.data;
}

// Menghapus kategori
export async function deleteCategory(id) {
const response = await api.delete(`/categories/${id}`);
return response.data;
}
