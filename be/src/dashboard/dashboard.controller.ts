// src/dashboard/dashboard.controller.ts
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
DashboardService


@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Lấy tồn kho
  @Get('inventory')
  async getInventory() {
    try {
      return await this.dashboardService.getInventory();
    } catch (error) {
      throw new HttpException('Lỗi khi lấy dữ liệu tồn kho', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy phiếu nhập gần đây
  @Get('stock-in')
  async getRecentStockIn(
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      return await this.dashboardService.getRecentStockIn(limit ? Number(limit) : 5, startDate, endDate);
    } catch (error) {
      throw new HttpException('Lỗi khi lấy dữ liệu phiếu nhập', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy phiếu xuất gần đây
  @Get('stock-out')
  async getRecentStockOut(
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      return await this.dashboardService.getRecentStockOut(limit ? Number(limit) : 5, startDate, endDate);
    } catch (error) {
      throw new HttpException('Lỗi khi lấy dữ liệu phiếu xuất', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy cảnh báo tồn kho thấp
  @Get('alerts')
  async getAlerts(@Query('threshold') threshold?: number) {
    try {
      return await this.dashboardService.getAlerts(threshold ? Number(threshold) : 10);
    } catch (error) {
      throw new HttpException('Lỗi khi lấy dữ liệu cảnh báo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy tổng tồn kho theo sản phẩm
  @Get('total-inventory')
  async getTotalInventoryByProduct() {
    try {
      return await this.dashboardService.getTotalInventoryByProduct();
    } catch (error) {
      throw new HttpException('Lỗi khi lấy tổng tồn kho', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy tổng nhập/xuất theo tháng
  @Get('monthly-summary')
  async getMonthlyStockSummary(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    if (!month || !year) {
      throw new HttpException('Thiếu tham số month hoặc year', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.dashboardService.getMonthlyStockSummary(month, year);
    } catch (error) {
      throw new HttpException('Lỗi khi lấy báo cáo tháng', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
