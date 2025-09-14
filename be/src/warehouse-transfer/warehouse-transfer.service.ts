// src/warehouse-transfer/warehouse-transfer.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WarehouseTransfer } from '../database/entities/warehouse-transfer.entity';
import { Product } from '../database/entities/product.entity';
import { Warehouse } from '../database/entities/warehouse.entity';
import { SubWarehouse } from '../database/entities/sub-warehouse.entity';

@Injectable()
export class WarehouseTransferService {
  constructor(private readonly dataSource: DataSource) {}

  async transferStock(data: {
    product_id: number;
    from_warehouse_id: number;
    to_sub_warehouse_id: number;
    quantity: number;
    note?: string;
  }) {
    const { product_id, from_warehouse_id, to_sub_warehouse_id, quantity, note } = data;

    const productRepo = this.dataSource.getRepository(Product);
    const warehouseRepo = this.dataSource.getRepository(Warehouse);
    const subWarehouseRepo = this.dataSource.getRepository(SubWarehouse);
    const transferRepo = this.dataSource.getRepository(WarehouseTransfer);

    const product = await productRepo.findOneBy({ product_id });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const warehouse = await warehouseRepo.findOneBy({ warehouse_id: from_warehouse_id });
    if (!warehouse) throw new NotFoundException('Kho chính không tồn tại');

    const subWarehouse = await subWarehouseRepo.findOne({
      where: { sub_id: to_sub_warehouse_id },
      relations: ['warehouse'],
    });
    if (!subWarehouse) throw new NotFoundException('Kho con không tồn tại');

    // TODO: Kiểm tra tồn kho trong warehouse
    // Giả sử product có quantity trong warehouse (cần table tồn kho)
    // const currentQty = await getInventory(product_id, from_warehouse_id);
    // if (quantity > currentQty) throw new BadRequestException('Không đủ số lượng trong kho chính');

    // Tạo record transfer
    const transfer = transferRepo.create({
      product,
      fromWarehouse: warehouse,
      toSubWarehouse: subWarehouse,
      quantity,
      note,
    });

    return transferRepo.save(transfer);
  }

  async getAllTransfers(): Promise<WarehouseTransfer[]> {
    const transferRepo = this.dataSource.getRepository(WarehouseTransfer);
    return transferRepo.find({
      relations: ['product', 'fromWarehouse', 'toSubWarehouse'],
      order: { transfer_date: 'DESC' },
    });
  }
}
