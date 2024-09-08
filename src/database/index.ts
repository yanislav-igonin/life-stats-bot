import { databaseConfig } from '../config';
import { DataSource } from 'typeorm';

export default new DataSource({
  entities: ['./database/models/*.model.ts'],
  migrations: ['./database/migrations/*.ts'],
  synchronize: true,
  type: 'postgres',
  ...databaseConfig,
});
