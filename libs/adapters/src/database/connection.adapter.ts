// Abstracted database connection logic

import { DataSource } from 'typeorm';

export const createConnection = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
  });

  await dataSource.initialize();
  return dataSource;
};
