import { Module } from '@nestjs/common';
import { CosechasService } from './cosechas.service';
import { CosechasController } from './cosechas.controller';
import { Cosecha } from './entities/cosecha.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { ConfigModule } from '@nestjs/config';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';
@Module({
  imports: [  TransactionLogsModule, ConfigModule, SequelizeModule.forFeature([Cosecha]), CacheModule.register(),    JwtModule.register({
    secret: process.env.JWT_SECRET || 'default_secret',
    signOptions: { expiresIn: '60m' },
  }) ],
  controllers: [CosechasController],
  providers: [CosechasService, JwtService, TransactionLogsService],
})
export class CosechasModule {}
