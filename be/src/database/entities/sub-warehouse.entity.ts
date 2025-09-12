// src/database/entities/sub-warehouse.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('sub_warehouses')
export class SubWarehouse {
  @PrimaryGeneratedColumn()
  sub_id: number;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;
}
