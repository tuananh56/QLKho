// src/warehouses/warehouses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../database/entities/warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepo.find();
  }

  async findOne(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepo.findOne({ where: { warehouse_id: id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }
    return warehouse;
  }

  async create(data: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = this.warehouseRepo.create(data);
    return this.warehouseRepo.save(warehouse);
  }

  async update(id: number, data: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    Object.assign(warehouse, data);
    return this.warehouseRepo.save(warehouse);
  }

  async remove(id: number): Promise<void> {
    const warehouse = await this.findOne(id);
    await this.warehouseRepo.remove(warehouse);
  }
}
