// src/inventory/inventory.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../database/entities/inventory.entity';

export interface InventoryItem {
  warehouse_id: number;
  product_id: number;
  quantity: number;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async findAll(): Promise<any[]> {
    const inventories = await this.inventoryRepo.find({
      relations: ['warehouse', 'product'],
    });

    return inventories.map((inv) => ({
      warehouse_id: inv.warehouse.warehouse_id,
      warehouse: inv.warehouse.name,
      product_id: inv.product.product_id,
      product: inv.product.name,
      quantity: inv.quantity,
    }));
  }

  async findByProduct(product_id: number): Promise<InventoryItem[]> {
    const inventories = await this.inventoryRepo.find({
      where: { product: { product_id } },
      relations: ['warehouse', 'product'],
    });

    return inventories.map((inv) => ({
      warehouse_id: inv.warehouse.warehouse_id,
      product_id: inv.product.product_id,
      quantity: inv.quantity,
    }));
  }

  async getInventorySummary(): Promise<any[]> {
  const inventories = await this.inventoryRepo.find({
    relations: ['warehouse', 'product', 'subWarehouse'],
  });

  const grouped: Record<number, any> = {};

  inventories.forEach((inv) => {
    const wId = inv.warehouse.warehouse_id;
    if (!grouped[wId]) {
      grouped[wId] = {
        warehouse_id: wId,
        warehouse: inv.warehouse.name,
        total: 0,
        sub_warehouses: {}, // gom sub warehouse
      };
    }

    // Nếu subWarehouse null, gán default
    const swId = inv.subWarehouse?.sub_id ?? 0; // 0 đại diện cho null
    if (!grouped[wId].sub_warehouses[swId]) {
      grouped[wId].sub_warehouses[swId] = {
        sub_id: inv.subWarehouse?.sub_id ?? null,
        sub_name: inv.subWarehouse?.name ?? 'Không có kho con',
        total: 0,
      };
    }

    grouped[wId].sub_warehouses[swId].total += inv.quantity;
    grouped[wId].total += inv.quantity;
  });

  return Object.values(grouped).map((w) => ({
    ...w,
    sub_warehouses: Object.values(w.sub_warehouses),
  }));
}

}
