import api from "./api";

// 1. Ambil semua data user
export const getUsers = async () => {
  const response = await api.get("/users");
  // Backend mengembalikan { message: "...", data: [...] }
  return response.data;
};

// 2. Ambil detail 1 user berdasarkan ID
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// 3. Tambah user baru
// userData berisi object: { nama, username, password, role }
export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

// 4. Update data user berdasarkan ID
// userData berisi object: { nama, username, password, role }
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// 5. Hapus user berdasarkan ID
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};