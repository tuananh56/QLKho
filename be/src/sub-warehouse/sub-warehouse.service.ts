import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubWarehouse } from '../database/entities/sub-warehouse.entity';
import { Warehouse } from '../database/entities/warehouse.entity';

@Injectable()
export class SubWarehouseService {
  constructor(
    @InjectRepository(SubWarehouse)
    private readonly subWarehouseRepo: Repository<SubWarehouse>,

    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
  ) {}

  // Lấy tất cả kho con
  async findAll(): Promise<SubWarehouse[]> {
    return this.subWarehouseRepo.find({ relations: ['warehouse'] });
  }

  // Lấy kho con theo ID
  async findOne(sub_id: number): Promise<SubWarehouse> {
    const subWarehouse = await this.subWarehouseRepo.findOne({
      where: { sub_id },
      relations: ['warehouse'],
    });
    if (!subWarehouse) {
      throw new NotFoundException(`SubWarehouse with id ${sub_id} not found`);
    }
    return subWarehouse;
  }

  // Tạo kho con mới
  async create(data: { warehouse_id: number; name: string; address?: string }): Promise<SubWarehouse> {
    const warehouse = await this.warehouseRepo.findOne({ where: { warehouse_id: data.warehouse_id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const subWarehouse = this.subWarehouseRepo.create({
      warehouse,
      name: data.name,
      address: data.address,
    });
    return this.subWarehouseRepo.save(subWarehouse);
  }

  // Cập nhật kho con
  async update(sub_id: number, data: Partial<SubWarehouse>): Promise<SubWarehouse> {
    const subWarehouse = await this.subWarehouseRepo.findOne({ where: { sub_id }, relations: ['warehouse'] });
    if (!subWarehouse) throw new NotFoundException(`SubWarehouse with id ${sub_id} not found`);

    Object.assign(subWarehouse, data);
    return this.subWarehouseRepo.save(subWarehouse);
  }

  // Xóa kho con
  async remove(sub_id: number): Promise<void> {
    const subWarehouse = await this.subWarehouseRepo.findOne({ where: { sub_id } });
    if (!subWarehouse) {
      throw new NotFoundException(`SubWarehouse with id ${sub_id} not found`);
    }
    await this.subWarehouseRepo.delete(sub_id);
  }
}
