import { CallHandler, ExecutionContext, Injectable, Inject  } from '@nestjs/common';
// import { CacheInterceptor, CACHE_MANAGER, CACHE_KEY_METADATA, CACHE_MODULE_OPTIONS, CACHE_TTL_METADATA, Cache, CacheManagerOptions, CacheKey, LiteralObject, CacheModule, CacheModuleAsyncOptions, CacheModuleOptions, CacheOptions, CacheOptionsFactory, CacheStore, CacheStoreFactory, CacheStoreSetOptions, CacheTTL  } from '@nestjs/cache-manager';
import { CacheInterceptor, CACHE_MANAGER, CACHE_KEY_METADATA, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { Cache } from 'cache-manager';
import { Request } from 'express'; // Import Request type from express

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    protected readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(cacheManager, reflector);

    // Modify intercept logic based on config
    const cacheEnabled = this.configService.get<string>('CACHE_ENABLED');
    if (cacheEnabled === 'false') {
      // Disable caching by overriding `intercept` method
      this.intercept = async (context: ExecutionContext, next: CallHandler): Promise<Observable<any>> => {
        // Simply proceed without caching
        return Promise.resolve(next.handle()); // Wrap the Observable in a Promise
      };
    }
  }

  /**
   * Modify this method when necessary to customize
   * the variables that are cached.
   * @param context
   * @returns 
   */
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>(); // Cast request to express Request
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );


    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const excludePaths = [
      // Routes to be excluded from caching
    ];

    if (cacheKey) return cacheKey; // Use manually set cache key


        // const requestUrl = request.url;
        // Cache only GET requests to prevent caching non-idempotent operations
        // if (request.method === 'GET') {
        //   return requestUrl;
        // }
        // return undefined;

    // if (!isGetRequest || excludePaths.includes(httpAdapter.getRequestUrl(request))) {
    //   return undefined;
    // }
    return httpAdapter.getRequestUrl(request);
  }

  
}



// import {
//   CacheInterceptor,
//   CACHE_KEY_METADATA, CallHandler, ExecutionContext, Injectable
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Observable } from 'rxjs';

// @Injectable()
// export class CustomCacheInterceptor extends CacheInterceptor {
//   constructor(
//     cacheManager: any,
//     reflector: any,
//     private readonly configService: ConfigService,
//   ) {
//     super(cacheManager, reflector);
//     const cacheEnabled = this.configService.get('CACHE_ENABLED');
//     if (cacheEnabled && cacheEnabled === 'false') {
//       this.intercept = async (
//         context: ExecutionContext,
//         next: CallHandler,
//       ): Promise<Observable<any>> => next.handle();
//     }
//   }

//   /**
//    * Mofificar este metodo cuando sea necesario personalizar 
//    * las variables que quedan en cache.
//    * @param context
//    * @returns 
//    */
//   trackBy(context: ExecutionContext): string | undefined {
//     const cacheKey = this.reflector.get(
//       CACHE_KEY_METADATA,
//       context.getHandler(),
//     );
//     if (cacheKey) {
//       const request = context.switchToHttp().getRequest();
//       let customKey = undefined;
//       if (cacheKey === 'REGIONES' || cacheKey === 'CIUDADES' || cacheKey === 'COMUNAS') {
//         customKey = `${request._parsedUrl.pathname.replace(/\/+$/, '')}`;
//       }
//       if (customKey) {
//         return customKey;
//       }
//     }
//     return super.trackBy(context);
//   }
// }
