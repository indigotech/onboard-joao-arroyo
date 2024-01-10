import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const appDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: '',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],
});
