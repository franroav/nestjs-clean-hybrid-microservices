// import { Module } from '@nestjs/common';
// import { VariedadesService } from './variedades.service';
// import { VariedadesController } from './variedades.controller';
// import { Variedad } from './entities/variedade.entity';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { JwtService } from '@nestjs/jwt';
// import { JwtModule } from '@nestjs/jwt';
// import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
// import { FrutasModule } from '../frutas/frutas.module'; // Import FrutasModule
// @Module({
//   imports: [
//     SequelizeModule.forFeature([Variedad]),
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'default_secret',
//       signOptions: { expiresIn: '60m' },
//     }),
//     FrutasModule,
//   ],
//   controllers: [VariedadesController],
//   providers: [VariedadesService, JwtService, TransactionLogsService],
//   exports: [VariedadesService],
// })
// export class VariedadesModule {}



import { Module } from '@nestjs/common';
import { VariedadesService } from './variedades.service';
import { VariedadesController } from './variedades.controller';
import { Variedad } from './entities/variedade.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { FrutasModule } from '../frutas/frutas.module'; // Import FrutasModule
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Variedad]),  // Register Variedad entity
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '60m' },
    }),
    TransactionLogsModule,
    FrutasModule,
  ],
  controllers: [VariedadesController],
  providers: [VariedadesService, JwtService, TransactionLogsService],
  exports: [VariedadesService],  // Export VariedadesService if it will be used elsewhere
})
export class VariedadesModule {}

