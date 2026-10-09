import api from "./api";

// Create / Checkout Transaction
export async function createTransaction(transactionData) {
  const response = await api.post("/transactions", transactionData);
  return response.data;
}

// Get All Transactions
export async function getTransactions(params) {
  const response = await api.get("/transactions", { params });
  return response.data;
}

// Get Transaction Detail By ID
export async function getTransactionById(id) {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
}