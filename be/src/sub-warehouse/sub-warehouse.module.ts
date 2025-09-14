// src/sub-warehouse/sub-warehouse.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubWarehouse } from '../database/entities/sub-warehouse.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { SubWarehouseService } from './sub-warehouse.service';
import { SubWarehouseController } from './sub-warehouse.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubWarehouse, Warehouse])],
  providers: [SubWarehouseService],
  controllers: [SubWarehouseController],
})
export class SubWarehouseModule {}
