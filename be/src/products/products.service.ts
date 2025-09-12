import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['manufacturer'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { product_id: id },
      relations: ['manufacturer'],
    });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.findOne(id); // check tồn tại
    await this.productRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productRepo.delete(id);
  }
}
