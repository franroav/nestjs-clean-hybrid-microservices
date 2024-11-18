import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async runMigration() {
    const migrationFilePath = path.join(__dirname, 'migration.sql');

    try {
      const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');
      await this.dataSource.query(migrationSQL);
      this.logger.log('Migration completed successfully.');
    } catch (error) {
      this.logger.error('Migration failed', error);
      throw error;
    }
  }
}

// // apps/billing-service/src/migration.service.ts
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { readFileSync } from 'fs';
// import { join } from 'path';

// @Injectable()
// export class MigrationService implements OnModuleInit {
//   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

//   async onModuleInit() {
//     await this.executeMigration();
//   }

//   private async executeMigration() {
//     const sqlPath = join(__dirname, 'migrations', 'migration.sql');
//     const sql = readFileSync(sqlPath, 'utf-8');

//     await this.dataSource.query(sql);
//     console.log('Migration executed successfully.');
//   }
// }
