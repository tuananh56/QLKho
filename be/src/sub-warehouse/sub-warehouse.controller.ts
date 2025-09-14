// src/sub-warehouse/sub-warehouse.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SubWarehouseService } from './sub-warehouse.service';
import { SubWarehouse } from '../database/entities/sub-warehouse.entity';

@Controller('sub-warehouse')
export class SubWarehouseController {
  constructor(private readonly subWarehouseService: SubWarehouseService) {}

  @Get()
  async getAll(): Promise<SubWarehouse[]> {
    return this.subWarehouseService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<SubWarehouse> {
    return this.subWarehouseService.findOne(id);
  }

  @Post()
  async create(@Body() body: { warehouse_id: number; name: string; address?: string }): Promise<SubWarehouse> {
    return this.subWarehouseService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<SubWarehouse>): Promise<SubWarehouse> {
    return this.subWarehouseService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.subWarehouseService.remove(id);
    return { message: 'SubWarehouse deleted successfully' };
  }
}
