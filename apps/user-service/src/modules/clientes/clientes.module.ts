import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
  imports: [
    TransactionLogsModule,
    SequelizeModule.forFeature([Cliente]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [ClientesController],
  providers: [ClientesService, TransactionLogsService],  // Make sure TransactionLogsService is provided
  exports: [ClientesService],
})
export class ClientesModule {}
