// src/database/entities/manufacturer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('manufacturers')
export class Manufacturer {
  @PrimaryGeneratedColumn()
  manufacturer_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  // Thêm quan hệ với Product
  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];
}
