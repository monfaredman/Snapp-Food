import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();
config({
  path: join(process.cwd(), `.env.${process.env.NODE_ENV}`),
});
export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
  return {
    type: 'mysql',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [
      'dist/**/**/**/*.entity{.ts,.js}',
      'dist/**/**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    autoLoadEntities: true,
  };
}
