import { startMigrations } from './database/migrations';
import { logger } from './utils/logger';


Promise.all([
    startMigrations()
]).catch((error) => {
    logger.error('Error running the software: ' + error.message);
})
