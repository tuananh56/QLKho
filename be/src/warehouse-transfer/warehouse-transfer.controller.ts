// src/warehouse-transfer/warehouse-transfer.controller.ts
import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { WarehouseTransferService } from './warehouse-transfer.service';

@Controller('warehouse-transfer')
export class WarehouseTransferController {
  constructor(private readonly transferService: WarehouseTransferService) {}

  @Post()
  async transferStock(@Body() body: any) {
    const { product_id, from_warehouse_id, to_sub_warehouse_id, quantity, note } = body;

    if (!product_id || !from_warehouse_id || !to_sub_warehouse_id || !quantity) {
      throw new BadRequestException('Thiếu thông tin bắt buộc');
    }

    return this.transferService.transferStock({
      product_id,
      from_warehouse_id,
      to_sub_warehouse_id,
      quantity,
      note,
    });
  }

  @Get()
  async getAllTransfers() {
    return this.transferService.getAllTransfers();
  }
}
