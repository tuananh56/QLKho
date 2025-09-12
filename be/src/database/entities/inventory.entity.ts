// src/database/entities/inventory.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';

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

  @Column({ default: 0 })
  quantity: number;
}
