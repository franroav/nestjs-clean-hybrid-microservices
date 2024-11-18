import { Module } from "@nestjs/common";
import { CacheServiceController } from "./cache.controller";
import { CacheService } from "./cache.service";
import { RedisModule } from "../redis/redis.module";
import { CacheModule, CacheInterceptor, CacheOptions } from "@nestjs/cache-manager";
import { ClientsModule, Transport } from "@nestjs/microservices";
import * as redisStore from 'cache-manager-redis-yet'; // Make sure this is the correct module path
import { APP_INTERCEPTOR } from "@nestjs/core";
import type { RedisClientOptions } from "redis";
import { AppConfigService } from "../../../../../libs/shared/src/config/app/configuration.service";
import { AppConfigModule } from "../../../../../libs/shared/src/config/app/config.module";

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService): Promise<CacheOptions | any> => ({
        store: redisStore, // Initialize the Redis store
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
        ttl: parseInt(configService.get('CACHE_TTL'), 10), // Ensure TTL is a number
      }),
      inject: [AppConfigService],
    }),
    AppConfigModule,
    RedisModule,
  ],
  controllers: [CacheServiceController],
  providers: [
    AppConfigService,
    CacheService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class CacheServiceModule {}


    // Redis Cache Configuration
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,

    //   // Store-specific configuration:
    //   host: 'localhost',
    //   port: 6379,
    //   ttl: 60, // Cache TTL of 60 seconds
    // }),