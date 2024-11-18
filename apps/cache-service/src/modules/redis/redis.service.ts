import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from "@nestjs/common";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { ClientProxy } from "@nestjs/microservices";
import Redis from "ioredis"; // ioredis client for direct Redis commands
import { PrismaService } from "../../../../libs/infrastructure/src/databases/prisma/prisma.service";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis; // ioredis client

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject CacheManager
    @Inject("CACHE_SERVICE") private client: ClientProxy, // Microservice Client
    private readonly prisma: PrismaService // Prisma service for MongoDB
  ) {
    // Initialize the Redis client with the URL of your Redis server
    // this.redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

  }

  async onModuleInit() {
    // Optional: Initialization logic can go here
  }

  async onModuleDestroy() {
    await this.redisClient.quit(); // Close direct Redis client connection
    await this.client.close(); // Close microservice client
  }

  // Direct Redis interaction (ioredis)
  async set(key: string, value: any, ttl: number) {
    await this.redisClient.set(key, JSON.stringify(value), "EX", ttl); // ioredis command
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error fetching key ${key} from Redis:`, error);
      return null; // or handle it differently
    }
  }
  
  // Example: Updating user and invalidating cache
  async updateUser(userId: string, updateData: any): Promise<any> {
    const result = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Invalidate the cache for this user
    await this.redisClient.del(`user-${userId}`);

    return result;
  }

  // Fetch user data from MongoDB with caching
  async getUserData(userId: string): Promise<any> {
    const cachedUser = await this.cacheManager.get(`user_${userId}`);
    if (cachedUser) {
      return cachedUser; // Return cached data if available
    }

    // Fetch user data from MongoDB via Prisma
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      // Cache the result for future requests
      await this.cacheManager.set(`user_${userId}`, user, 300); // Directly pass the ttl
    }

    return user;
  }

  // Send a message to another microservice via Redis transport (ClientProxy)
  async sendMessageToMicroservice(message: string): Promise<string> {
    const response = await this.client
      .send<string, string>("message_channel", message)
      .toPromise();

    return `Microservice Response: ${response}`;
  }
}
