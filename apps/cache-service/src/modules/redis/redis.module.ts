import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { PrismaService } from '../../../../libs/infrastructure/src/databases/prisma/prisma.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

// Redis Client Provider
const redisClientProvider = {
  provide: 'CACHE_SERVICE',
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'redis', // Default to localhost for local development
        port: 6379,        // Your Redis server port
      },
    });
  },
};

@Module({
  imports: [
    // CacheModule, // Import CacheModule to make CACHE_MANAGER available
    CacheModule.register({ // <-- Ensure you register CacheModule properly
      store: 'redis', // Define redis as the cache store
      host: process.env.REDIS_HOST || 'redis', // Redis host
      port:  6379, // Redis port parseInt(process.env.REDIS_PORT) ||
      ttl: 60 * 5,       // Optional: Set time-to-live for cache entries
    }),
  ],
  providers: [RedisService,  PrismaService, redisClientProvider],
  exports: [RedisService],
})
export class RedisModule {}