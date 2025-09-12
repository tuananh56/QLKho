// D:\QLKho\fe\src/types.ts
export interface InventoryItem {
  product: string;
  warehouse: string;
  quantity: number;
}

export interface StockInItem {
  stock_in_id: number;
  product: string;
  warehouse?: { name: string; warehouse_id?: number } | null;
  quantity: number;
  date_in: string;
  manufacturer?: { name: string; manufacturer_id?: number } | null;
  note?: string;
}

export interface StockOutItem {
  stock_out_id: number;
  product: string;
  quantity: number;
  date_out: string;
  store: string | null;
}

export interface AlertItem {
  product: string;
  warehouse: string;
  quantity: number;
}

export interface TotalInventoryItem {
  product: string;
  total_quantity: number;
}
