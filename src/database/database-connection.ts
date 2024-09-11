import pgPromise, { IMain } from 'pg-promise';
import { env } from 'process';

const dbConfig = {
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT!),
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  allowExitOnIdle: true,
};

// Initializing the library:
const pgp: IMain = pgPromise();

// Creating the database instance with extensions:
const db = pgp(dbConfig);

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
export { db, pgp };
