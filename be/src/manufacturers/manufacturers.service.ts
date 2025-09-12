// src/manufacturers/manufacturers.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from '../database/entities/manufacturer.entity';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) {}

  findAll(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { manufacturer_id: id },
      relations: ['products'],
    });
    if (!manufacturer) {
      throw new Error(`Manufacturer with id ${id} not found`);
    }
    return manufacturer;
  }

  create(data: Partial<Manufacturer>): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create(data);
    return this.manufacturerRepository.save(manufacturer);
  }

  async update(id: number, data: Partial<Manufacturer>): Promise<Manufacturer> {
    await this.manufacturerRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.manufacturerRepository.delete(id);
  }
}
