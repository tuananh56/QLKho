// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../database/entities/inventory.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { Product } from '../database/entities/product.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Warehouse, Product])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
