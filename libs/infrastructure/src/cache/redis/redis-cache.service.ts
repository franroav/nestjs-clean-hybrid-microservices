import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
  }

  onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
// import { Injectable, Logger } from '@nestjs/common';
// import { createClient } from 'redis';

// @Injectable()
// export class RedisCacheService {
//   private client;

//   constructor() {
//     this.client = createClient();
//     this.client.on('error', (err) => {
//       Logger.error('Redis Client Error', err);
//     });
//   }

//   async set(key: string, value: string): Promise<void> {
//     await this.client.set(key, value);
//   }

//   async get(key: string): Promise<string | null> {
//     return await this.client.get(key);
//   }

//   async del(key: string): Promise<void> {
//     await this.client.del(key);
//   }
// }
