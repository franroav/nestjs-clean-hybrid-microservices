import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@app/shared/strategies/local.strategy'; // Import LocalStrategy
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '60m' },
    }),
    TransactionLogsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy], // Include LocalStrategy here
  exports: [JwtModule],
})
export class AuthModule {}