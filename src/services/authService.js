import api from "./api";

// LOGIN
export const login = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  const data = response.data;

  // Simpan JWT
  localStorage.setItem("token", data.token);

  // Simpan data user
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// AMBIL TOKEN
export const getToken = () => {
  return localStorage.getItem("token");
};

// AMBIL USER
export const getUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

// CEK LOGIN
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
