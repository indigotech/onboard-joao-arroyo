import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'local_user',
  password: 'taqlocal',
  database: 'local_db',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],
});
