import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Address } from './entity/Address';

export const appDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: '',
  synchronize: true,
  logging: false,
  entities: [User, Address],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],
});
