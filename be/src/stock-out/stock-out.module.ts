// src/stock-out/stock-out.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOutService } from './stock-out.service';
import { StockOutController } from './stock-out.controller';
import { StockOut } from '../database/entities/stock-out.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { Product } from '../database/entities/product.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { Store } from '../database/entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOut, Inventory, Product, Warehouse, Store]),
  ],
  providers: [StockOutService],
  controllers: [StockOutController],
  exports: [StockOutService],
})
export class StockOutModule {}
