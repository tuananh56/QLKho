// src/inventory/inventory.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory(@Query('product_id') product_id?: string) {
    if (product_id) {
      return this.inventoryService.findByProduct(Number(product_id));
    }
    return this.inventoryService.findAll();
  }
  // 👉 Thêm endpoint mới
  @Get('summary')
  async getInventorySummary() {
    return this.inventoryService.getInventorySummary();
  }
}
