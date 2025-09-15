import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { StockIn } from '../database/entities/stock-in.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { Product } from '../database/entities/product.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { Manufacturer } from '../database/entities/manufacturer.entity';

export interface StockInItem {
  stock_in_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_in: string;
  manufacturer: string | null;
  note: string;
}

@Injectable()
export class StockInService {
  constructor(
    @InjectRepository(StockIn) private stockInRepo: Repository<StockIn>,
    @InjectRepository(Inventory) private inventoryRepo: Repository<Inventory>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Warehouse) private warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Manufacturer)
    private manufacturerRepo: Repository<Manufacturer>,
  ) {}

  // Tạo lô hàng nhập
  async createStockIn(data: {
    warehouse_id: number;
    product_id: number;
    quantity: number;
    from_manufacturer?: number;
    note?: string;
  }): Promise<StockIn> {
    const { warehouse_id, product_id, quantity, from_manufacturer, note } =
      data;

    if (!Number.isInteger(quantity) || quantity <= 0)
      throw new BadRequestException('Số lượng phải là số nguyên lớn hơn 0');

    const warehouse = await this.warehouseRepo.findOne({
      where: { warehouse_id },
    });
    if (!warehouse) throw new NotFoundException('Kho không tồn tại');

    const product = await this.productRepo.findOne({ where: { product_id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    let manufacturer: Manufacturer | null = null;
    if (from_manufacturer) {
      manufacturer = await this.manufacturerRepo.findOne({
        where: { manufacturer_id: from_manufacturer },
      });
      if (!manufacturer)
        throw new NotFoundException('Nhà sản xuất không tồn tại');
    }

    const stockIn = this.stockInRepo.create({
      warehouse,
      product,
      manufacturer,
      quantity,
      note,
    });
    await this.stockInRepo.save(stockIn);

    // Cập nhật tồn kho
    let inventory = await this.inventoryRepo.findOne({
      where: { warehouse: { warehouse_id }, product: { product_id } },
    });
    if (!inventory) {
      inventory = this.inventoryRepo.create({ warehouse, product, quantity });
    } else {
      inventory.quantity += quantity;
    }
    await this.inventoryRepo.save(inventory);

    return stockIn;
  }

  async updateStockIn(
    id: number,
    data: Partial<{
      warehouse_id: number;
      product_id: number;
      quantity: number;
      from_manufacturer?: number;
      note?: string;
    }>,
  ): Promise<StockInItem | null> {
    const stockIn = await this.stockInRepo.findOne({
      where: { stock_in_id: id },
      relations: ['warehouse', 'product', 'manufacturer'],
    });
    if (!stockIn) return null;

    const oldWarehouseId = stockIn.warehouse?.warehouse_id;
    const oldProductId = stockIn.product?.product_id;
    const oldQuantity = stockIn.quantity;

    // cập nhật warehouse
    if (data.warehouse_id && data.warehouse_id !== oldWarehouseId) {
      const warehouse = await this.warehouseRepo.findOne({
        where: { warehouse_id: data.warehouse_id },
      });
      if (!warehouse) throw new NotFoundException('Kho không tồn tại');
      stockIn.warehouse = warehouse;
    }

    // cập nhật product
    if (data.product_id && data.product_id !== oldProductId) {
      const product = await this.productRepo.findOne({
        where: { product_id: data.product_id },
      });
      if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
      stockIn.product = product;
    }

    // cập nhật quantity
    if (data.quantity !== undefined) {
      if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
        throw new BadRequestException('Số lượng phải là số nguyên lớn hơn 0');
      }
      stockIn.quantity = data.quantity;
    }

    if (data.from_manufacturer) {
      const manufacturer = await this.manufacturerRepo.findOne({
        where: { manufacturer_id: data.from_manufacturer },
      });
      if (!manufacturer)
        throw new NotFoundException('Nhà sản xuất không tồn tại');
      stockIn.manufacturer = manufacturer;
    }

    if (data.note !== undefined) stockIn.note = data.note;

    await this.stockInRepo.save(stockIn);

    // 🔹 Cập nhật tồn kho nếu số lượng/kho/sản phẩm thay đổi
    if (
      data.quantity !== undefined ||
      data.warehouse_id !== undefined ||
      data.product_id !== undefined
    ) {
      // trừ số lượng cũ
      const oldInventory = await this.inventoryRepo.findOne({
        where: {
          warehouse: { warehouse_id: oldWarehouseId },
          product: { product_id: oldProductId },
        },
      });
      if (oldInventory) {
        oldInventory.quantity -= oldQuantity;
        if (oldInventory.quantity < 0) oldInventory.quantity = 0;
        await this.inventoryRepo.save(oldInventory);
      }

      // cộng số lượng mới
      const newInventory = await this.inventoryRepo.findOne({
        where: {
          warehouse: { warehouse_id: stockIn.warehouse.warehouse_id },
          product: { product_id: stockIn.product.product_id },
        },
      });
      if (newInventory) {
        newInventory.quantity += stockIn.quantity;
        await this.inventoryRepo.save(newInventory);
      } else {
        const createdInventory = this.inventoryRepo.create({
          warehouse: stockIn.warehouse,
          product: stockIn.product,
          quantity: stockIn.quantity,
        });
        await this.inventoryRepo.save(createdInventory);
      }
    }

    return {
      stock_in_id: stockIn.stock_in_id,
      product: stockIn.product?.name ?? '',
      warehouse: stockIn.warehouse?.name ?? '',
      quantity: stockIn.quantity,
      date_in: stockIn.date_in.toISOString(),
      manufacturer: stockIn.manufacturer?.name ?? '',
      note: stockIn.note ?? '',
    };
  }

  async deleteStockIn(id: number): Promise<boolean> {
    const stockIn = await this.stockInRepo.findOne({
      where: { stock_in_id: id },
      relations: ['warehouse', 'product'],
    });
    if (!stockIn) return false;

    // 🔹 Cập nhật tồn kho trước khi xóa
    const inventory = await this.inventoryRepo.findOne({
      where: {
        warehouse: { warehouse_id: stockIn.warehouse.warehouse_id },
        product: { product_id: stockIn.product.product_id },
      },
    });
    if (inventory) {
      inventory.quantity -= stockIn.quantity;
      if (inventory.quantity < 0) inventory.quantity = 0;
      await this.inventoryRepo.save(inventory);
    }

    await this.stockInRepo.delete({ stock_in_id: id });
    return true;
  }

  // Lấy danh sách tất cả lô nhập
  async getAllStockIn(): Promise<StockInItem[]> {
    const stockIns = await this.stockInRepo.find({
      relations: ['warehouse', 'product', 'manufacturer'],
      order: { date_in: 'DESC' },
      take: 100,
    });

    return stockIns.map((s) => ({
      stock_in_id: s.stock_in_id,
      product: s.product?.name ?? '', // nếu s.product?.name null hoặc undefined thì dùng ""
      warehouse: s.warehouse?.name ?? '', // tương tự
      quantity: s.quantity,
      date_in: s.date_in.toISOString(),
      manufacturer: s.manufacturer?.name ?? '',
      note: s.note ?? '', // nếu s.note null hoặc undefined
    }));
  }

  // Lấy lô nhập theo ID
  async getStockInById(id: number): Promise<StockInItem | null> {
    const s = await this.stockInRepo.findOne({
      where: { stock_in_id: id },
      relations: ['warehouse', 'product', 'manufacturer'],
    });

    if (!s) return null;

    return {
      stock_in_id: s.stock_in_id,
      product: s.product?.name ?? 'Unknown',
      warehouse: s.warehouse?.name ?? '-',
      quantity: s.quantity,
      date_in: s.date_in.toISOString(),
      manufacturer: s.manufacturer?.name ?? '-',
      note: s.note ?? '-',
    };
  }

  // Trong StockInService
  async getAllStockInRaw(): Promise<StockInItem[]> {
    const stockIns: any[] = await this.stockInRepo.query(`
    SELECT 
      s.stock_in_id, 
      p.name AS product, 
      w.name AS warehouse,
      s.quantity, 
      s.date_in, 
      m.name AS manufacturer,
      s.note
    FROM stock_in s
    JOIN products p ON s.product_id = p.product_id
    LEFT JOIN warehouses w ON s.warehouse_id = w.warehouse_id
    LEFT JOIN manufacturers m ON s.from_manufacturer = m.manufacturer_id
    ORDER BY s.date_in DESC
  `);

    // Chuyển đổi dữ liệu sang interface StockInItem
    return stockIns.map((s) => ({
      stock_in_id: s.stock_in_id,
      product: s.product ?? '',
      warehouse: s.warehouse ?? '',
      quantity: s.quantity,
      date_in: new Date(s.date_in).toISOString(),
      manufacturer: s.manufacturer ?? '',
      note: s.note ?? '',
    }));
  }
  // stock-in.service.ts
  async searchStockIn(
    search?: string, // từ khóa tìm kiếm
    sort: 'asc' | 'desc' = 'desc', // sắp xếp theo date_in
  ): Promise<StockInItem[]> {
    let query = `
    SELECT 
      s.stock_in_id, 
      p.name AS product, 
      w.name AS warehouse,
      s.quantity, 
      s.date_in, 
      m.name AS manufacturer,
      s.note
    FROM stock_in s
    JOIN products p ON s.product_id = p.product_id
    LEFT JOIN warehouses w ON s.warehouse_id = w.warehouse_id
    LEFT JOIN manufacturers m ON s.from_manufacturer = m.manufacturer_id
  `;

    if (search) {
      // tìm theo tên sản phẩm, kho, hoặc nhà sản xuất
      query += ` WHERE p.name LIKE '%${search}%' 
               OR w.name LIKE '%${search}%' 
               OR m.name LIKE '%${search}%'`;
    }

    query += ` ORDER BY s.date_in ${sort.toUpperCase()}`;

    const stockIns: any[] = await this.stockInRepo.query(query);

    return stockIns.map((s) => ({
      stock_in_id: s.stock_in_id,
      product: s.product ?? '',
      warehouse: s.warehouse ?? '',
      quantity: s.quantity,
      date_in: new Date(s.date_in).toISOString(),
      manufacturer: s.manufacturer ?? '',
      note: s.note ?? '',
    }));
  }
  // stock-in.service.ts
  async getMonthlyReport(year: number) {
    const rawData: { month: number; total_quantity: string }[] =
      await this.stockInRepo.query(
        `
      SELECT 
        EXTRACT(MONTH FROM date_in) AS month, 
        SUM(quantity) AS total_quantity
      FROM stock_in
      WHERE EXTRACT(YEAR FROM date_in) = $1
      GROUP BY month
      ORDER BY month
    `,
        [year],
      );

    // Chuyển về mảng đủ 12 tháng, nếu tháng nào không có dữ liệu thì gán 0
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
