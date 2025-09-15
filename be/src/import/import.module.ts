import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { StockInModule } from 'src/stock-in/stock-in.module';
import { StockOutModule } from 'src/stock-out/stock-out.module';
import { ImportService } from './import.service';

@Module({
  imports: [StockInModule, StockOutModule], // import cả 2 module
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
