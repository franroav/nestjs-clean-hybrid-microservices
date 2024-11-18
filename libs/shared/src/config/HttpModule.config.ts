import {
  HttpService,
  Module,
  OnModuleInit,
  HttpModule as BaseHttpModule,
  Logger,
} from '@nestjs/common';

//No utilizado por el momento
@Module({
  imports: [BaseHttpModule],
  exports: [BaseHttpModule],
})
export class HttpModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) { }

  public onModuleInit(): any {
    const logger = new Logger('Axios');

    const axios = this.httpService.axiosRef;

    axios.interceptors.request.use(function (config) {
      config['metadata'] = { ...config['metadata'], startDate: new Date() };
      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        const { config } = response;
        config['metadata'] = { ...config['metadata'], endDate: new Date() };

        return response;
      },
      (err) => {
        const errorDetail = {
          statusCode: err.response.status,
          statusMessage: err.response.statusText,
          ErrorMessage: err.response.data.message,
          method: err.config.method,
          url: err.config.url,
          headers: err.config.headers,
        };

        logger.error(JSON.stringify(errorDetail));
        return Promise.reject(err);
      },
    );
  }
}
