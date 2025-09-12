// src/database/entities/store.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  store_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  phone: string;
}
