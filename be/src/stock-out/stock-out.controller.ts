// src/stock-out/stock-out.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StockOutService, StockOutItem } from './stock-out.service';
import { StockOut } from '../database/entities/stock-out.entity';

@Controller('stock-out')
export class StockOutController {
  constructor(private readonly stockOutService: StockOutService) {}

  @Post()
  async create(
    @Body()
    body: {
      warehouse_id: number;
      product_id: number;
      quantity: number;
      to_store?: number;
      note?: string;
    },
  ): Promise<StockOut> {
    return this.stockOutService.createStockOut(body);
  }

  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<StockOutItem[]> {
    return this.stockOutService.searchStockOut(search, sort ?? 'desc');
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<StockOutItem | null> {
    return this.stockOutService.getStockOutById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ success: boolean }> {
    const success = await this.stockOutService.deleteStockOut(id);
    return { success };
  }

  // src/stock-out/stock-out.controller.ts
  @Get('report/monthly')
  async getMonthlyReport(@Query('year') year: string) {
    const y = parseInt(year) || new Date().getFullYear();
    return this.stockOutService.getMonthlyReport(y);
  }
}
