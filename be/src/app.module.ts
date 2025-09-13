// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './dashboard/dashboard.module';
import { Manufacturer } from './database/entities/manufacturer.entity';
import { Product } from './database/entities/product.entity';
import { Warehouse } from './database/entities/warehouse.entity';
import { SubWarehouse } from './database/entities/sub-warehouse.entity';
import { Inventory } from './database/entities/inventory.entity';
import { StockIn } from './database/entities/stock-in.entity';
import { StockOut } from './database/entities/stock-out.entity';
import { Store } from './database/entities/store.entity';
import { WarehouseTransfer } from './database/entities/warehouse-transfer.entity';
import { StockInModule } from './stock-in/stock-in.module';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { StockOutModule } from './stock-out/stock-out.module'; 
import { StoresModule } from './stores/stores.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0000',
      database: 'KhoDB',
      synchronize: true,
      logging: true,
      entities: [
        Manufacturer,
        Product,
        Warehouse,
        SubWarehouse,
        Inventory,
        StockIn,
        StockOut,
        Store,
        WarehouseTransfer,
      ],
    }),
    DashboardModule,
    StockInModule,
    StockOutModule,
    ProductsModule,
    WarehousesModule,
    ManufacturersModule,
    StoresModule,
    InventoryModule,
  ],
})
export class AppModule {}
