import { Module } from '@nestjs/common';
import configuration from './configuration';
import { AppConfigService } from './configuration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

const envPath = ['./apps/delivery-service/.env'];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: envPath,
      expandVariables: true,
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppMicroServiceConfigModule { }
