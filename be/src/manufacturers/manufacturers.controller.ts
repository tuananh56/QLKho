// src/manufacturers/manufacturers.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from '../database/entities/manufacturer.entity';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get()
  findAll(): Promise<Manufacturer[]> {
    return this.manufacturersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Manufacturer> {
    return this.manufacturersService.findOne(+id);
  }

  @Post()
  create(@Body() manufacturerData: Partial<Manufacturer>): Promise<Manufacturer> {
    return this.manufacturersService.create(manufacturerData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() manufacturerData: Partial<Manufacturer>,
  ): Promise<Manufacturer> {
    return this.manufacturersService.update(+id, manufacturerData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.manufacturersService.remove(+id);
  }
}
