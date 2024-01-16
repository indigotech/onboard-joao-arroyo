import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const appDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: '',
  synchronize: true,
  logging: false,
  entities: ['dist/entity/*.js'],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],
});
