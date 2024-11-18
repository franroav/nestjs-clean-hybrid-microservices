import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from "@nestjs/common";
import { RedisService } from "../redis/redis.service";


@Injectable()
export class CacheService {
  constructor(
    private readonly redisService: RedisService,
  ) {}

  async getCacheValue(key: string): Promise<string | null> {
    return this.redisService.get(key);
  }

  async setCacheValue(key: string, value: string): Promise<string> {
    await this.redisService.set(key, value, 300);
    return value;
  }

  async getUserData(userId: string): Promise<any> {
    const result = await this.redisService.getUserData(userId);
    return result;
  }

  // Send a message to another microservice via Redis transport
  async sendMessageToMicroservice(message: string): Promise<any> {
    const result = await this.redisService.sendMessageToMicroservice(message);
    return result;
  }
}
