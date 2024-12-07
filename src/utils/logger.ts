import pino from 'pino';
import { env } from 'node:process';

export const logger = pino({
  level: env.LOG_LEVEL,
});
