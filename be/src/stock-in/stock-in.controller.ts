// src/stock-in/stock-in.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { StockInService, StockInItem } from './stock-in.service';
import { StockIn } from '../database/entities/stock-in.entity';

@Controller('stock-in')
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  // Tạo phiếu nhập mới
  @Post()
  async create(
    @Body()
    body: {
      warehouse_id: number;
      product_id: number;
      quantity: number;
      from_manufacturer?: number;
      note?: string;
    },
  ): Promise<StockIn> {
    return this.stockInService.createStockIn(body);
  }

  // Lấy tất cả phiếu nhập (có thể search & sort)
  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<StockInItem[]> {
    return this.stockInService.searchStockIn(search, sort ?? 'desc');
  }

  // Lấy lô nhập theo ID
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<StockInItem | null> {
    return this.stockInService.getStockInById(id);
  }

  // Cập nhật lô nhập theo ID
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body()
    body: Partial<{
      warehouse_id: number;
      product_id: number;
      quantity: number;
      from_manufacturer?: number;
      note?: string;
    }>,
  ): Promise<StockInItem | null> {
    return this.stockInService.updateStockIn(id, body);
  }

  // Xóa lô nhập theo ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ success: boolean }> {
    const success = await this.stockInService.deleteStockIn(id);
    return { success };
  }

  @Get('report/monthly')
  async getMonthlyReport(@Query('year') year: string) {
    const y = parseInt(year) || new Date().getFullYear();
    return this.stockInService.getMonthlyReport(y);
  }
}
