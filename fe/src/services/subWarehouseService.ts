// src/services/subWarehouseService.ts
import api from './api';
import axios from 'axios'; // dùng để override baseURL khi cần

// ============================
// Interface TypeScript
// ============================

export interface Warehouse {
  warehouse_id: number;
  name: string;
  address?: string;
  is_main?: boolean;
}

export interface SubWarehouse {
  sub_id: number;
  warehouse: Warehouse;
  name: string;
  address?: string;
}

// DTO tạo mới
export interface CreateSubWarehouseDto {
  warehouse_id: number;
  name: string;
  address?: string;
}

// DTO cập nhật
export interface UpdateSubWarehouseDto {
  warehouse_id?: number;
  name?: string;
  address?: string;
}

// ============================
// Service functions
// ============================

/**
 * Lấy tất cả kho con
 */
export const getAllSubWarehouse = async (): Promise<SubWarehouse[]> => {
  try {
    const { data } = await axios.get<SubWarehouse[]>('http://localhost:4001/sub-warehouse');
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho con:', error);
    throw error;
  }
};

/**
 * Lấy kho con theo id
 */
export const getSubWarehouseById = async (id: number): Promise<SubWarehouse> => {
  try {
    const { data } = await axios.get<SubWarehouse>(`http://localhost:4001/sub-warehouse/${id}`);
    return data;
  } catch (error) {
    console.error(`Lỗi khi lấy kho con ID=${id}:`, error);
    throw error;
  }
};

/**
 * Tạo kho con mới
 */
export const createSubWarehouse = async (
  payload: CreateSubWarehouseDto
): Promise<SubWarehouse> => {
  try {
    const { data } = await axios.post<SubWarehouse>('http://localhost:4001/sub-warehouse', payload);
    return data;
  } catch (error) {
    console.error('Lỗi khi tạo kho con:', error);
    throw error;
  }
};

/**
 * Cập nhật kho con
 */
export const updateSubWarehouse = async (
  id: number,
  payload: UpdateSubWarehouseDto
): Promise<SubWarehouse> => {
  try {
    const { data } = await axios.put<SubWarehouse>(`http://localhost:4001/sub-warehouse/${id}`, payload);
    return data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật kho con ID=${id}:`, error);
    throw error;
  }
};

/**
 * Xóa kho con
 */
export const deleteSubWarehouse = async (id: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:4001/sub-warehouse/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa kho con ID=${id}:`, error);
    throw error;
  }
};

/**
 * Lấy tất cả kho cha (warehouses) để FE hiển thị dropdown
 */
export const getAllWarehouse = async (): Promise<Warehouse[]> => {
  try {
    const { data } = await axios.get<Warehouse[]>('http://localhost:4001/warehouses');
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho cha:', error);
    throw error;
  }
};
