// src/database/entities/inventory.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';
import { SubWarehouse } from './sub-warehouse.entity';

@Entity('inventory')
@Unique(['warehouse', 'product'])
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => SubWarehouse, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_id' })
  subWarehouse?: SubWarehouse;

  @Column({ default: 0 })
  quantity: number;
}
