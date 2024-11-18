import { Controller, Get, Param, Query } from '@nestjs/common';
import { CacheServiceService } from './cache.service';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class CacheServiceController {
  constructor(private readonly cacheServiceService: CacheServiceService) {}

  @Get(':key')
  async getValue(@Param('key') key: string): Promise<string> {
    const value = await this.cacheServiceService.getCacheValue(key);
    return value || '';  // Handle null values
  }

  @Get(':key/:value')
  async setValue(@Param('key') key: string, @Param('value') value: string): Promise<string> {
    return this.cacheServiceService.setCacheValue(key, value);
  }

  @Get('user/:id')
  @CacheKey('user_cache')
  @CacheTTL(300)
  async getUser(@Param('id') id: string): Promise<any> {
    return this.cacheServiceService.getUserData(id);
  }

  @Get('message')
  async sendMessage(@Query('msg') msg: string): Promise<string> {
    return this.cacheServiceService.sendMessageToMicroservice(msg);
  }
}

// import { Controller, Get, Param, Query } from "@nestjs/common";
// import { CacheServiceService } from "./cache-service.service";
// import { CacheKey, CacheTTL } from "@nestjs/cache-manager";

// @Controller()
// export class CacheServiceController {
//   constructor(private readonly cacheServiceService: CacheServiceService) {}

//   @Get(":key")
//   async getValue(@Param("key") key: string): Promise<string> {
//     const value = await this.cacheServiceService.getCacheValue(key);
//     return value || ""; // Handle null by returning an empty string or a default value
//   }

//   @Get(":key/:value")
//   async setValue(
//     @Param("key") key: string,
//     @Param("value") value: string
//   ): Promise<string> {
//     const setValue = this.cacheServiceService.setCacheValue(key, value);
//     return setValue || ""; // Handle null by returning an empty string or a default value
//   }

//   // API to get user data (will use Redis for caching)
//   @Get("user/:id")
//   @CacheKey("user_cache")
//   @CacheTTL(300)
//   async getUser(@Param("id") id: string): Promise<any> {
//     const value = this.cacheServiceService.getUserData(id);
//     return value || ""; // Handle null by returning an empty string or a default value
//   }

//   // API to send a message to another microservice via Redis transport
//   @Get("message")
//   async sendMessage(@Query("msg") msg: string): Promise<string> {
//     const value = this.cacheServiceService.sendMessageToMicroservice(msg);
//     return value || ""; // Handle null by returning an empty string or a default value
//   }
// }
