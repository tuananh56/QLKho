// src/database/entities/warehouse.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  warehouse_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ default: true })
  is_main: boolean;
}
