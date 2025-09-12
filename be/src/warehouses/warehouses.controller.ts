// src/warehouses/warehouses.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from '../database/entities/warehouse.entity';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  findAll(): Promise<Warehouse[]> {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Warehouse> {
    return this.warehousesService.findOne(+id);
  }

  @Post()
  create(@Body() body: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehousesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehousesService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.warehousesService.remove(+id);
  }
}
