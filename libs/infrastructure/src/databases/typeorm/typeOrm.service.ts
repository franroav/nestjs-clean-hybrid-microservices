import { DataSource } from 'typeorm';
const development = true

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 8889,
        username: 'root',
        password: 'root',
        database: 'typeorm_test',
        entities: [
          __dirname + '/../**/**.entity{.ts,.js}',
        ],
        synchronize: development, // Replaces `autoSchemaSync`
        logging: 'all',
        extra: {
          connectionLimit: 10, // Connection pool size (maximum number of connections in the pool)
        },
      });

      return await dataSource.initialize(); // Initialize the DataSource
    },
  },
];