import { Module, DynamicModule, Global } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Global() // Optional: Makes this module available globally
@Module({})
export class UnifiedDatabaseModule {
     // Main MongoDB URI
  private static readonly MAIN_URI = 'mongodb://root:password123@mongodb-primary:27017';
  static forRoot(uri?: string, options?: MongooseModuleOptions): DynamicModule {
    if (uri) {
      // Use static configuration if uri is provided
      return {
        module: UnifiedDatabaseModule,
        imports: [MongooseModule.forRoot(uri, options)],
      };
    }

    // Use async configuration
    return {
      module: UnifiedDatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            // const user = configService.get<string>('bankferDB.user');
            // const pass = configService.get<string>('bankferDB.pass');
            // const principal = configService.get<string>('bankferDB.principal');
            // const read = configService.get<string>('bankferDB.read');
            // const port = configService.get<number>('bankferDB.port');

            // // Construct the URI using the parameters or defaults
            const dbName = configService.get<string>('bankferDB.name');
            // const constructedUri = `mongodb://${user}:${pass}@${principal}:${port},${read}:${port}/${dbName}?replicaSet=rs0&readPreference=secondaryPreferred`;
            // Construct the URI using the parameters or use the main URI as a fallback
            const constructedUri = uri || `${UnifiedDatabaseModule.MAIN_URI}/${dbName}`;

            return {
              uri: constructedUri,
              ...options, // Spread additional options
              useNewUrlParser: true,
              useUnifiedTopology: true,
              retryWrites: false,
              poolSize: 20,
            };
          },
        }),
      ],
    };
  }
}
