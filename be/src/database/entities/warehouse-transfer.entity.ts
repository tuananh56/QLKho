// src/database/entities/warehouse-transfer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { SubWarehouse } from './sub-warehouse.entity';

@Entity('warehouse_transfer')
export class WarehouseTransfer {
  @PrimaryGeneratedColumn()
  transfer_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'from_warehouse' })
  fromWarehouse: Warehouse;

  @ManyToOne(() => SubWarehouse)
  @JoinColumn({ name: 'to_sub_warehouse' })
  toSubWarehouse: SubWarehouse;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transfer_date: Date;

  @Column({ type: 'text', nullable: true })
  note: string;
}
