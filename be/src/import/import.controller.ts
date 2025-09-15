import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  // Import Stock In
  @Post('stock-in')
  @UseInterceptors(FileInterceptor('file'))
  async importStockIn(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file for stock-in:', file?.originalname);
    console.log('File size:', file?.size);

    if (!file) {
      throw new Error('No file uploaded for stock-in');
    }

    const result = await this.importService.importStockIn(file.buffer);
    console.log('Import stock-in result:', result);
    return result;
  }

  // Import Stock Out
  @Post('stock-out')
  @UseInterceptors(FileInterceptor('file'))
  async importStockOut(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file for stock-out:', file?.originalname);
    console.log('File size:', file?.size);

    if (!file) {
      throw new Error('No file uploaded for stock-out');
    }

    const result = await this.importService.importStockOut(file.buffer);
    console.log('Import stock-out result:', result);
    return result;
  }
}
