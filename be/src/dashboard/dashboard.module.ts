// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import các entity cần thiết để service query dữ liệu
import { Product } from '../database/entities/product.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { SubWarehouse } from '../database/entities/sub-warehouse.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { StockIn } from '../database/entities/stock-in.entity';
import { StockOut } from '../database/entities/stock-out.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Warehouse,
      SubWarehouse,
      Inventory,
      StockIn,
      StockOut,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
