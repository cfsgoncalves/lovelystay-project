import { logger } from './utils/logger';
import { startMigrations } from './database/migrations';
import { createCli } from './presentation/cli';
import { exit } from 'process';

const migrations = Promise.resolve(startMigrations()).catch((error) => {
  logger.error('Failed to start migrations' + error);
  exit(1);
});

migrations
  .then(async () => {
    const displayUsers = await createCli();
    console.log(displayUsers);
  })
  .catch((error) => {
    logger.error('Failed to start migrations' + error);
    exit(1);
  });
