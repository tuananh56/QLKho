// src/manufacturers/manufacturers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from '../database/entities/manufacturer.entity';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
