/* istanbul ignore file */

import {
  HttpModuleOptions,
  HttpModuleOptionsFactory,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 10000,
      maxRedirects: 5,
    };
  }
}
