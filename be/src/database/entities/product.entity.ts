// src/database/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Manufacturer, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;

  @Column({ length: 50, default: 'cái' })
  unit: string;
}
