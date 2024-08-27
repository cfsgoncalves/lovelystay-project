import { errors } from 'pg-promise';
import { db } from './databaseConnection';
import { logger } from '../utils/logger';

export type User = {
    username: string;
    profile_url: string;
    location: string;
    repos_url: string;
};

export async function createUser(user: User): Promise<Error | string> {
    const username = await db.one('INSERT INTO Users(username,profile_url,location,repos_url) VALUES($<username>,$<profile_url>,$<location>,$<repos_url>) RETURNING username', user);

    if (!username) {
        logger.error('Failed to create user');
        return new Error('Failed to create user');
    }

    return username;
}