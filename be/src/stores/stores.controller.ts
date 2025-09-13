// src/stores/stores.controller.ts
import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from '../database/entities/store.entity';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async findAll(): Promise<Store[]> {
    return this.storesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Store | null> {
    return this.storesService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Store>): Promise<Store> {
    return this.storesService.create(data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    const deleted = await this.storesService.remove(id);
    return { deleted };
  }
}
