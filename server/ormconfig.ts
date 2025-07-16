import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Payment } from './src/payments/entities/payment.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'Admin',
  database: process.env.DATABASE_NAME || 'payment_dashboard',
  synchronize: false,
  logging: true,
  entities: [User, Payment],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
});