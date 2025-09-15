import { Injectable, BadRequestException } from '@nestjs/common';
import { StockInService } from 'src/stock-in/stock-in.service';
import { StockOutService } from 'src/stock-out/stock-out.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportService {
  constructor(
    private stockInService: StockInService,
    private stockOutService: StockOutService,
  ) {}

  // Hàm import stock-in
  async importStockIn(fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (!rows.length) throw new BadRequestException('File Excel trống');

    for (const row of rows) {
      const product_id = Number(row.product_id);
      const warehouse_id = Number(row.warehouse_id);
      const quantity = Number(row.quantity);
      const manufacturer_id = row.manufacturer_id ? Number(row.manufacturer_id) : undefined;
      const note = row.note ?? '';

      if (!product_id || !warehouse_id || !quantity) {
        console.warn('Bỏ qua dòng không hợp lệ:', row);
        continue;
      }

      await this.stockInService.createStockIn({
        product_id,
        warehouse_id,
        quantity,
        from_manufacturer: manufacturer_id,
        note,
      });
    }

    return { message: 'Import Excel stock-in thành công', total: rows.length };
  }

  // Hàm import stock-out
  async importStockOut(fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (!rows.length) throw new BadRequestException('File Excel trống');

    for (const row of rows) {
      const product_id = Number(row.product_id);
      const warehouse_id = Number(row.warehouse_id);
      const quantity = Number(row.quantity);
      const to_store = row.store ?? '';
      const note = row.note ?? '';

      if (!product_id || !warehouse_id || !quantity) {
        console.warn('Bỏ qua dòng không hợp lệ:', row);
        continue;
      }

      await this.stockOutService.createStockOut({
        product_id,
        warehouse_id,
        quantity,
        to_store,
        note,
      });
    }

    return { message: 'Import Excel stock-out thành công', total: rows.length };
  }
}
