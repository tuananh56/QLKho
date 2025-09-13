// src/services/stockoutService.ts
import api from './api';

export interface StockOutItem {
  stock_out_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_out: string;
  store: string | null;
  note: string;
}

// Lấy tất cả stock out
export const getAllStockOut = async (): Promise<StockOutItem[]> => {
  try {
    const response = await api.get<StockOutItem[]>('/stock-out'); // url tương ứng
    return response.data;
  } catch (error) {
    console.error('Error fetching stock out:', error);
    throw error;
  }
};

// Lấy stock out theo id
export const getStockOutById = async (id: number): Promise<StockOutItem> => {
  try {
    const response = await api.get<StockOutItem>(`/stock-out/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock out ${id}:`, error);
    throw error;
  }
};

// Tạo stock out mới
export const createStockOut = async (data: {
  warehouse_id: number;
  product_id: number;
  quantity: number;
  to_store?: number;
  note?: string;
}): Promise<StockOutItem> => {
  try {
    const response = await api.post<StockOutItem>('/stock-out', data);
    return response.data;
  } catch (error) {
    console.error('Error creating stock out:', error);
    throw error;
  }
};

// Xóa stock out
export const deleteStockOut = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/stock-out/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting stock out ${id}:`, error);
    throw error;
  }
};
