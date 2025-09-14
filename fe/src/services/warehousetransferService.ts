// src/services/warehousetransferService.ts
import axios from 'axios';
import { Warehouse, SubWarehouse } from './subWarehouseService';

// ============================
// Interface TypeScript
// ============================
export interface Product {
  product_id: number;
  name: string;
  unit?: string;
}

export interface WarehouseTransfer {
  transfer_id: number;
  product: Product;
  fromWarehouse: Warehouse;
  toSubWarehouse: SubWarehouse;
  quantity: number;
  transfer_date: string;
  note?: string;
}

export interface CreateTransferDto {
  product_id: number;
  from_warehouse_id: number;
  to_sub_warehouse_id: number;
  quantity: number;
  note?: string;
}

// ============================
// Axios riêng cho warehouse transfer
// ============================
const transferApi = axios.create({
  baseURL: "http://localhost:4001", // không có /dashboard
  headers: { "Content-Type": "application/json" },
});

// ============================
// Service functions
// ============================
export const getAllTransfers = async (): Promise<WarehouseTransfer[]> => {
  const { data } = await transferApi.get<WarehouseTransfer[]>('/warehouse-transfer');
  return data;
};

export const getTransferById = async (id: number): Promise<WarehouseTransfer> => {
  const { data } = await transferApi.get<WarehouseTransfer>(`/warehouse-transfer/${id}`);
  return data;
};

export const createTransfer = async (payload: CreateTransferDto): Promise<WarehouseTransfer> => {
  const { data } = await transferApi.post<WarehouseTransfer>('/warehouse-transfer', payload);
  return data;
};

export const deleteTransfer = async (id: number): Promise<void> => {
  await transferApi.delete(`/warehouse-transfer/${id}`);
};
