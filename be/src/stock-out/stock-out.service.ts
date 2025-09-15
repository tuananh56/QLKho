// src/stock-out/stock-out.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockOut } from '../database/entities/stock-out.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { Product } from '../database/entities/product.entity';
import { Store } from '../database/entities/store.entity';
import { Inventory } from '../database/entities/inventory.entity';

export interface StockOutItem {
  stock_out_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_out: string;
  store: string | null;
  note: string;
}

@Injectable()
export class StockOutService {
  constructor(
    @InjectRepository(StockOut) private stockOutRepo: Repository<StockOut>,
    @InjectRepository(Inventory) private inventoryRepo: Repository<Inventory>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Warehouse) private warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
  ) {}

  async createStockOut(data: {
    warehouse_id: number;
    product_id: number;
    quantity: number;
    to_store?: number;
    note?: string;
  }): Promise<StockOut> {
    const { warehouse_id, product_id, quantity, to_store, note } = data;

    if (!Number.isInteger(quantity) || quantity <= 0)
      throw new BadRequestException('Số lượng phải là số nguyên lớn hơn 0');

    const warehouse = await this.warehouseRepo.findOne({
      where: { warehouse_id },
    });
    if (!warehouse) throw new NotFoundException('Kho không tồn tại');

    const product = await this.productRepo.findOne({ where: { product_id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    let store: Store | null = null;
    if (to_store) {
      const s = await this.storeRepo.findOne({ where: { store_id: to_store } });
      if (!s) throw new NotFoundException('Store không tồn tại');
      store = s;
    }

    // Cập nhật tồn kho
    const inventory = await this.inventoryRepo.findOne({
      where: { warehouse: { warehouse_id }, product: { product_id } },
    });
    if (!inventory || inventory.quantity < quantity) {
      throw new BadRequestException('Kho không đủ hàng để xuất');
    }
    inventory.quantity -= quantity;
    await this.inventoryRepo.save(inventory);

    const stockOut = this.stockOutRepo.create({
      warehouse,
      product,
      store,
      quantity,
      note,
    });
    await this.stockOutRepo.save(stockOut);

    return stockOut;
  }

  async getAllStockOut(): Promise<StockOutItem[]> {
    const stockOuts = await this.stockOutRepo.find({
      relations: ['warehouse', 'product', 'store'],
      order: { date_out: 'DESC' },
      take: 100,
    });

    return stockOuts.map((s) => ({
      stock_out_id: s.stock_out_id,
      product: s.product?.name ?? '',
      warehouse: s.warehouse?.name ?? '',
      quantity: s.quantity,
      date_out: s.date_out.toISOString(),
      store: s.store?.name ?? '',
      note: s.note ?? '',
    }));
  }

  async getStockOutById(id: number): Promise<StockOutItem | null> {
    const s = await this.stockOutRepo.findOne({
      where: { stock_out_id: id },
      relations: ['warehouse', 'product', 'store'],
    });
    if (!s) return null;

    return {
      stock_out_id: s.stock_out_id,
      product: s.product?.name ?? 'Unknown',
      warehouse: s.warehouse?.name ?? '-',
      quantity: s.quantity,
      date_out: s.date_out.toISOString(),
      store: s.store?.name ?? '-',
      note: s.note ?? '-',
    };
  }

  async deleteStockOut(id: number): Promise<boolean> {
    const stockOut = await this.stockOutRepo.findOne({
      where: { stock_out_id: id },
      relations: ['warehouse', 'product'],
    });
    if (!stockOut) return false;

    // Hoàn trả lại tồn kho
    const inventory = await this.inventoryRepo.findOne({
      where: {
        warehouse: { warehouse_id: stockOut.warehouse.warehouse_id },
        product: { product_id: stockOut.product.product_id },
      },
    });
    if (inventory) {
      inventory.quantity += stockOut.quantity;
      await this.inventoryRepo.save(inventory);
    }

    await this.stockOutRepo.delete({ stock_out_id: id });
    return true;
  }

  async searchStockOut(
    search?: string,
    sort: 'asc' | 'desc' = 'desc',
  ): Promise<StockOutItem[]> {
    let query = `
      SELECT
        s.stock_out_id,
        p.name AS product,
        w.name AS warehouse,
        s.quantity,
        s.date_out,
        st.name AS store,
        s.note
      FROM stock_out s
      JOIN products p ON s.product_id = p.product_id
      LEFT JOIN warehouses w ON s.warehouse_id = w.warehouse_id
      LEFT JOIN stores st ON s.to_store = st.store_id
    `;

    const params: any[] = [];
    if (search) {
      query += ` WHERE p.name ILIKE $1 OR w.name ILIKE $1 OR st.name ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY s.date_out ${sort.toUpperCase()} LIMIT 100`;

    const stockOuts: any[] = await this.stockOutRepo.query(query, params);

    return stockOuts.map((s) => ({
      stock_out_id: s.stock_out_id,
      product: s.product ?? '',
      warehouse: s.warehouse ?? '',
      quantity: s.quantity,
      date_out: new Date(s.date_out).toISOString(),
      store: s.store ?? '',
      note: s.note ?? '',
    }));
  }

  // src/stock-out/stock-out.service.ts
  async getMonthlyReport(year: number) {
    const rawData: { month: number; total_quantity: string }[] =
      await this.stockOutRepo.query(
        `
      SELECT 
        EXTRACT(MONTH FROM date_out) AS month, 
        SUM(quantity) AS total_quantity
      FROM stock_out
      WHERE EXTRACT(YEAR FROM date_out) = $1
      GROUP BY month
      ORDER BY month
    `,
        [year],
      );

    // Đảm bảo trả về đủ 12 tháng
    const result = Array.from({ length: 12 }, (_, i) => {
      const monthData = rawData.find((d) => Number(d.month) === i + 1);
      return {
        month: i + 1,
        total_quantity: monthData ? Number(monthData.total_quantity) : 0,
      };
    });

    return result;
  }
}
