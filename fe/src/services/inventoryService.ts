// src/services/inventoryService.ts
import axios from "axios";
import { InventoryItem, TotalInventoryItem } from "../types";

// ============================
// Axios riêng cho inventory
// ============================
const inventoryApi = axios.create({
  baseURL: "http://localhost:4001", // không có /dashboard
  headers: { "Content-Type": "application/json" },
});

// ============================
// Service functions
// ============================

/**
 * Lấy tất cả tồn kho
 */
export const getAllInventory = async (): Promise<InventoryItem[]> => {
  const { data } = await inventoryApi.get<InventoryItem[]>("/inventory");
  return data;
};

/**
 * Lấy tồn kho theo product_id
 */
export const getInventoryByProduct = async (
  product_id: number
): Promise<InventoryItem[]> => {
  const { data } = await inventoryApi.get<InventoryItem[]>(
    `/inventory?product_id=${product_id}`
  );
  return data;
};

/**
 * Lấy tổng hợp tồn kho (theo sản phẩm)
 */
export const getInventorySummary = async (): Promise<TotalInventoryItem[]> => {
  const { data } = await inventoryApi.get<TotalInventoryItem[]>("/inventory/summary");
  return data;
};
