import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../database/entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  findAll(): Promise<Store[]> {
    return this.storeRepo.find();
  }

  findOne(id: number): Promise<Store | null> {
    return this.storeRepo.findOneBy({ store_id: id });
  }

  create(data: Partial<Store>): Promise<Store> {
    const store = this.storeRepo.create(data);
    return this.storeRepo.save(store);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.storeRepo.delete(id);
     return (result.affected ?? 0) > 0;
  }
}
