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
    const warehouse = await this.warehouseRepo.findOne({
      where: { warehouse_id: id },
    });
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
  async getWarehouseSummary() {
    const sql = `
      WITH sub_quantities AS (
        SELECT 
            w.warehouse_id,
            w.name AS warehouse,
            sw.name AS sub_name,
            COALESCE(SUM(wt.quantity), 0) AS quantity_in_sub
        FROM sub_warehouses sw
        JOIN warehouses w ON sw.warehouse_id = w.warehouse_id
        LEFT JOIN warehouse_transfer wt 
            ON wt.to_sub_warehouse = sw.sub_id
        GROUP BY w.warehouse_id, w.name, sw.name
      ),
      warehouse_totals AS (
        SELECT 
            w.warehouse_id,
            COALESCE(SUM(wt.quantity),0) AS quantity_in_warehouse
        FROM warehouses w
        LEFT JOIN warehouse_transfer wt 
            ON wt.from_warehouse = w.warehouse_id
        GROUP BY w.warehouse_id
      )
      SELECT 
          sq.warehouse,
          wt.quantity_in_warehouse AS quantity,
          sq.sub_name,
          sq.quantity_in_sub,
          wt.quantity_in_warehouse AS quantity_in_warehouse
      FROM sub_quantities sq
      JOIN warehouse_totals wt ON sq.warehouse_id = wt.warehouse_id
      ORDER BY sq.warehouse, sq.sub_name;
    `;
    return this.warehouseRepo.query(sql);
  }
}
