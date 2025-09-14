import api from "./api";
import { InventoryItem } from "../types"; // dùng lại type từ types.ts

/**
 * Lấy tất cả tồn kho
 */
export const getAllInventory = async (): Promise<InventoryItem[]> => {
  try {
    const { data } = await api.get<InventoryItem[]>("/inventory");
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy tồn kho:", error);
    throw error;
  }
};

/**
 * Lấy tồn kho theo product_id
 */
export const getInventoryByProduct = async (
  product_id: number
): Promise<InventoryItem[]> => {
  try {
    const { data } = await api.get<InventoryItem[]>(
      `/inventory?product_id=${product_id}`
    );
    return data;
  } catch (error) {
    console.error(`Lỗi khi lấy tồn kho cho product_id=${product_id}:`, error);
    throw error;
  }
};
