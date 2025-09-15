// src/warehouses/warehouses.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from '../database/entities/warehouse.entity';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  // Route để lấy tổng hợp tồn kho, số lượng sản phẩm
  @Get('summary') // PHẢI ĐỨNG TRƯỚC ':id'
  getSummary() {
    return this.warehousesService.getWarehouseSummary();
  }

  // Lấy tất cả kho
  @Get()
  findAll(): Promise<Warehouse[]> {
    return this.warehousesService.findAll();
  }

  // Lấy một kho theo id, với ParseIntPipe để tự động parse và validate
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Warehouse> {
    return this.warehousesService.findOne(id);
  }

  // Tạo mới kho
  @Post()
  create(@Body() body: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehousesService.create(body);
  }

  // Cập nhật kho
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Warehouse>,
  ): Promise<Warehouse> {
    return this.warehousesService.update(id, body);
  }

  // Xóa kho
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.warehousesService.remove(id);
  }
}
