  // src/services/stockInService.ts
  import api from "./api";

  // ============================
  // Interface TypeScript
  // ============================

  export interface Warehouse {
    warehouse_id: number;
    name: string;
    address?: string;
    is_main?: boolean;
  }

  export interface Product {
    product_id: number;
    name: string;
    unit?: string;
  }

  export interface Manufacturer {
    manufacturer_id: number;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  }

  export interface StockIn {
    stock_in_id: number;
    warehouse: Warehouse | null; // ← sửa ở đây
    product: Product;
    quantity: number;
    date_in: string;
    manufacturer: Manufacturer | null; // ← sửa ở đây
    note: string;
  }

  // DTO cho tạo mới
  export interface CreateStockInDto {
    warehouse_id: number;
    product_id: number;
    quantity: number;
    from_manufacturer?: number;
    note?: string;
  }

  // DTO cho update
  export interface UpdateStockInDto {
    warehouse_id?: number;
    product_id?: number;
    quantity?: number;
    from_manufacturer?: number;
    note?: string;
  }

  // ============================
  // Service functions
  // ============================

  /**
   * Lấy danh sách tất cả lô hàng nhập
   */
  export const getStockInList = async (): Promise<StockIn[]> => {
    try {
      const { data } = await api.get<StockIn[]>("/stock-in"); // ép kiểu StockIn[]
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lô hàng nhập:", error);
      throw error;
    }
  };

  /**
   * Lấy lô hàng theo ID
   */
  export const getStockInById = async (id: number): Promise<StockIn> => {
    try {
      const { data } = await api.get<StockIn>(`/stock-in/${id}`);
      return data;
    } catch (error) {
      console.error(`Lỗi khi lấy lô hàng nhập ID=${id}:`, error);
      throw error;
    }
  };

  /**
   * Tạo lô hàng nhập mới
   */
  export const createStockIn = async (
    payload: CreateStockInDto
  ): Promise<StockIn> => {
    try {
      const { data } = await api.post<StockIn>("/stock-in", payload);
      return data;
    } catch (error) {
      console.error("Lỗi khi tạo lô hàng nhập:", error);
      throw error;
    }
  };

  /**
   * Cập nhật lô hàng nhập theo ID
   */
  export const updateStockIn = async (
    id: number,
    payload: UpdateStockInDto
  ): Promise<StockIn> => {
    try {
      const { data } = await api.put<StockIn>(`/stock-in/${id}`, payload);
      return data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật lô hàng nhập ID=${id}:`, error);
      throw error;
    }
  };

  /**
   * Xóa lô hàng nhập theo ID
   */
  export const deleteStockIn = async (id: number): Promise<void> => {
    try {
      await api.delete(`/stock-in/${id}`);
    } catch (error) {
      console.error(`Lỗi khi xóa lô hàng nhập ID=${id}:`, error);
      throw error;
    }
  };
