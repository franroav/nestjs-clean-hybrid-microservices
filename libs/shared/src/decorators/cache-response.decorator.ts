import {  UseInterceptors } from '@nestjs/common';
import { CacheModule, CacheInterceptor, CacheOptions } from "@nestjs/cache-manager";


export function CacheResponse() {
  return UseInterceptors(CacheInterceptor);
}