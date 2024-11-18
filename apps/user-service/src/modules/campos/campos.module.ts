import { Module } from '@nestjs/common';
import { CamposService } from './campos.service';
import { CamposController } from './campos.controller';
import { Campo } from './entities/campo.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
  imports: [TransactionLogsModule, SequelizeModule.forFeature([Campo]),     JwtModule.register({
    secret: process.env.JWT_SECRET || 'default_secret',
    signOptions: { expiresIn: '60m' },
  })],
  controllers: [CamposController],
  providers: [CamposService, JwtService, TransactionLogsService],
  exports: [CamposService],
})
export class CamposModule {}
