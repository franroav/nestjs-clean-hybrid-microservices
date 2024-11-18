import { Module } from '@nestjs/common';
import { EmailServiceController } from './email-service.controller';
import { EmailService } from './email-service.service';
import { AppConfigModule } from '../../../libs/shared/src/config/app/config.module';
import { AppConfigService } from '../../../libs/shared/src/config/app/configuration.service';


@Module({
  imports: [AppConfigModule],
  controllers: [EmailServiceController],
  providers: [EmailService, AppConfigService,],
})
export class EmailServiceModule {}
