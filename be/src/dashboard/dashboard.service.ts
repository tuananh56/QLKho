// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Lấy danh sách tồn kho tất cả sản phẩm theo kho
   */
  async getInventory() {
    return this.dataSource.query(`
      SELECT p.name AS product, w.name AS warehouse, i.quantity
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      JOIN warehouses w ON i.warehouse_id = w.warehouse_id
      ORDER BY w.warehouse_id, p.product_id
    `);
  }

  /**
   * Lấy 5 phiếu nhập kho gần đây
   * @param limit số lượng phiếu muốn lấy (default 5)
   * @param startDate optional: lọc từ ngày
   * @param endDate optional: lọc đến ngày
   */
  async getRecentStockIn(limit = 5, startDate?: string, endDate?: string) {
    let query = `
      SELECT s.stock_in_id, p.name AS product, s.quantity, s.date_in, m.name AS manufacturer
      FROM stock_in s
      JOIN products p ON s.product_id = p.product_id
      LEFT JOIN manufacturers m ON s.from_manufacturer = m.manufacturer_id
    `;
    if (startDate && endDate) {
      query += ` WHERE s.date_in BETWEEN '${startDate}' AND '${endDate}'`;
    }
    query += ` ORDER BY s.date_in DESC LIMIT ${limit}`;
    return this.dataSource.query(query);
  }

  /**
   * Lấy 5 phiếu xuất kho gần đây
   * @param limit số lượng phiếu muốn lấy (default 5)
   * @param startDate optional: lọc từ ngày
   * @param endDate optional: lọc đến ngày
   */
  async getRecentStockOut(limit = 5, startDate?: string, endDate?: string) {
    let query = `
      SELECT s.stock_out_id, p.name AS product, s.quantity, s.date_out, st.name AS store
      FROM stock_out s
      JOIN products p ON s.product_id = p.product_id
      LEFT JOIN stores st ON s.to_store = st.store_id
    `;
    if (startDate && endDate) {
      query += ` WHERE s.date_out BETWEEN '${startDate}' AND '${endDate}'`;
    }
    query += ` ORDER BY s.date_out DESC LIMIT ${limit}`;
    return this.dataSource.query(query);
  }

  /**
   * Lấy danh sách sản phẩm tồn kho thấp (cảnh báo)
   * @param threshold ngưỡng tồn kho (mặc định < 10)
   */
  async getAlerts(threshold = 10) {
    return this.dataSource.query(`
      SELECT p.name AS product, w.name AS warehouse, i.quantity
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      JOIN warehouses w ON i.warehouse_id = w.warehouse_id
      WHERE i.quantity < ${threshold}
      ORDER BY i.quantity ASC
    `);
  }

  /**
   * Lấy tổng số lượng tồn kho của từng sản phẩm
   */
  async getTotalInventoryByProduct() {
    return this.dataSource.query(`
      SELECT p.name AS product, SUM(i.quantity) AS total_quantity
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      GROUP BY p.name
      ORDER BY total_quantity ASC
    `);
  }

  /**
   * Lấy tổng số phiếu nhập / xuất theo tháng
   * @param month số tháng (1-12)
   * @param year năm
   */
  async getMonthlyStockSummary(month: number, year: number) {
    return this.dataSource.query(`
      SELECT 
        (SELECT COALESCE(SUM(quantity),0) FROM stock_in WHERE EXTRACT(MONTH FROM date_in) = ${month} AND EXTRACT(YEAR FROM date_in) = ${year}) AS total_in,
        (SELECT COALESCE(SUM(quantity),0) FROM stock_out WHERE EXTRACT(MONTH FROM date_out) = ${month} AND EXTRACT(YEAR FROM date_out) = ${year}) AS total_out
    `);
  }
}
