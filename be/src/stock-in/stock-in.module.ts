// src/stock-in/stock-in.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInService } from './stock-in.service';
import { StockInController } from './stock-in.controller';
import { StockIn } from '../database/entities/stock-in.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { Product } from '../database/entities/product.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { Manufacturer } from '../database/entities/manufacturer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockIn,
      Inventory,
      Product,
      Warehouse,
      Manufacturer, // 👈 thêm vào
    ]),
  ],
  providers: [StockInService],
  controllers: [StockInController],
})
export class StockInModule {}
