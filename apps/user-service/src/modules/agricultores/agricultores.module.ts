import { Module } from '@nestjs/common';
import { AgricultoresService } from './agricultores.service';
import { AgricultoresController } from './agricultores.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Agricultor } from './entities/agricultore.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
  imports: [SequelizeModule.forFeature([Agricultor]),     JwtModule.register({
    secret: process.env.JWT_SECRET || 'default_secret',
    signOptions: { expiresIn: '60m' },
  }), TransactionLogsModule],
  controllers: [AgricultoresController],
  providers: [AgricultoresService, JwtService, TransactionLogsService],
  exports: [AgricultoresService],
})
export class AgricultoresModule {}