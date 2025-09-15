// src/services/warehouseService.ts
import axios from 'axios';
import { InventorySummary } from '../types';

const API_URL = 'http://localhost:4001/warehouses/summary';

export const getWarehouseSummary = async (): Promise<InventorySummary[]> => {
  const res = await axios.get<InventorySummary[]>(API_URL); // dùng generic type
  return res.data;
};
