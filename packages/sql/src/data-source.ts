import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { BgWikiPage } from './entities/BgWikiPage';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'ffxi_dev',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [BgWikiPage],
  migrations: ['dist/migrations/*.js'],
  subscribers: ['dist/subscribers/*.js'],
});

export async function initializeDatabase(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Database connection initialized');
  }
  return AppDataSource;
}
