// src/database/entities/stock-in.entity.ts
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
import { Manufacturer } from './manufacturer.entity';

@Entity('stock_in')
export class StockIn {
  @PrimaryGeneratedColumn()
  stock_in_id: number;

  // Quan hệ với kho
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  // Quan hệ với sản phẩm
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Số lượng nhập
  @Column()
  quantity: number;

  // Ngày nhập (tự động tạo)
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_in: Date;

  // Quan hệ với nhà sản xuất (có thể null)
  @ManyToOne(() => Manufacturer, { nullable: true })
  @JoinColumn({ name: 'from_manufacturer' })
  manufacturer?: Manufacturer | null;

  // Ghi chú (optional)
  @Column({ type: 'text', nullable: true })
  note?: string;
}
