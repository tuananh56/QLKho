// src/database/entities/stock-out.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';
import { Store } from './store.entity';

@Entity('stock_out')
export class StockOut {
  @PrimaryGeneratedColumn()
  stock_out_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_out: Date;

  @ManyToOne(() => Store, { nullable: true })
  @JoinColumn({ name: 'to_store' })
  store: Store | null; // <- thêm "| null"

  @Column({ type: 'text', nullable: true })
  note: string;
}
