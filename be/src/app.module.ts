import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',      // user của bạn
      password: '0000', // mật khẩu
      database: 'KhoDB',
      autoLoadEntities: true,
      synchronize: true,         // ⚠️ chỉ bật khi dev
    }),
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (this.dataSource.isInitialized) {
        this.logger.log('✅ Kết nối PostgreSQL thành công!');
      } else {
        await this.dataSource.initialize();
        this.logger.log('✅ PostgreSQL đã được kết nối!');
      }
    } catch (error) {
      this.logger.error('❌ Lỗi kết nối PostgreSQL:', error);
    }
  }
}
