import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  // appActiveDatabase: any;
  constructor(private configService: ConfigService) {}

  get(key: string): string {
    return this.configService.get<string>(key, '');
  }

  get name(): string {
    return this.configService.get<string>('app.name', 'defaultAppName');
  }
  get appActiveDatabase(): boolean {
    return this.configService.get<boolean>('app.appActiveDataBase', true);
  }
  
  get env(): string {
    return this.configService.get<string>('app.env', 'development');
  }

  get url(): string {
    return this.configService.get<string>('app.url', 'http://localhost');
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port', 3000));
  }

  get activarSwagger(): boolean {
    return Boolean(this.configService.get<boolean>('app.activarSwagger', true));
  }

  // General database configuration
  get dbHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME', 'root');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'password');
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME', 'mydatabase');
  }

  // PostgreSQL specific configuration
  get postgresDbHost(): string {
    return this.configService.get<string>('POSTGRES_DB_HOST', 'localhost');
  }

  get postgresDbPort(): number {
    return this.configService.get<number>('POSTGRES_DB_PORT', 5432);
  }

  get postgresDbUsername(): string {
    return this.configService.get<string>('POSTGRES_DB_USERNAME', 'postgres');
  }

  get postgresDbPassword(): string {
    return this.configService.get<string>('POSTGRES_DB_PASSWORD', 'password');
  }

  get postgresDbName(): string {
    return this.configService.get<string>('POSTGRES_DB_NAME', 'postgresdb');
  }

  // MongoDB specific configuration
  get mongoDbHost(): string {
    return this.configService.get<string>('MONGO_DB_HOST', 'localhost');
  }

  get mongoDbPort(): number {
    return this.configService.get<number>('MONGO_DB_PORT', 27017);
  }

  get mongoDbUsername(): string {
    return this.configService.get<string>('MONGO_DB_USERNAME', 'mongo');
  }

  get mongoDbPassword(): string {
    return this.configService.get<string>('MONGO_DB_PASSWORD', 'password');
  }

  get mongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME', 'mongodb');
  }

  // Redis specific configuration
  get redisDbHost(): string {
    return this.configService.get<string>('REDIS_DB_HOST', 'localhost');
  }

  get redisDbPort(): number {
    return this.configService.get<number>('REDIS_DB_PORT', 6379);
  }

  get redisDbUsername(): string {
    return this.configService.get<string>('REDIS_DB_USERNAME', 'redis');
  }

  get redisDbPassword(): string {
    return this.configService.get<string>('REDIS_DB_PASSWORD', 'password');
  }

  get redisDbName(): string {
    return this.configService.get<string>('REDIS_DB_NAME', 'redisdb');
  }
}
