import { migrate } from 'postgres-migrations';
import { env } from 'node:process';
import { logger } from '../utils/logger';

export async function startMigrations(): Promise<void> {
  if (
    env.DB_NAME === undefined ||
    env.DB_USER === undefined ||
    env.DB_PASSWORD === undefined ||
    env.DB_HOST === undefined ||
    env.DB_PORT === undefined
  ) {
    logger.error('Missing database configuration');
    return;
  }
  const dbConfig = {
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    defaultDatabase: 'postgres',
    ensureDatabaseExists: true,
  };

  return Promise.all([migrate(dbConfig, 'src/database/migrations')])
    .then(() => {
      logger.info('Migrations ran successfully');
    })
    .catch((error) => {
      logger.error('Error running migrations: ' + error.message);
    });
}
