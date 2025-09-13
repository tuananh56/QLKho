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

  async findAll(): Promise<InventoryItem[]> {
    const inventories = await this.inventoryRepo.find({
      relations: ['warehouse', 'product'],
    });

    return inventories.map((inv) => ({
      warehouse_id: inv.warehouse.warehouse_id,
      product_id: inv.product.product_id,
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
}
