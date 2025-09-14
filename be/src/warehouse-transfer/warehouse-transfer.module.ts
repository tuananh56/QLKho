// src/warehouse-transfer/warehouse-transfer.module.ts
import { Module } from '@nestjs/common';
import { WarehouseTransferController } from './warehouse-transfer.controller';
import { WarehouseTransferService } from './warehouse-transfer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseTransfer } from '../database/entities/warehouse-transfer.entity';
import { Product } from '../database/entities/product.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { SubWarehouse } from '../database/entities/sub-warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseTransfer, Product, Warehouse, SubWarehouse])],
  controllers: [WarehouseTransferController],
  providers: [WarehouseTransferService],
})
export class WarehouseTransferModule {}
