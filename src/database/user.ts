import { db } from './database-connection';
import { logger } from '../utils/logger';

export interface User {
  username: string;
  profile_url: string;
  location: string;
  repos_url: string;
  created_at: Date;
}

export async function createUser(user: User): Promise<Error | string> {
  try {
    const username = await db.one(
      'INSERT INTO Users(username,profile_url,location,repos_url,created_at) VALUES($<username>,$<profile_url>,$<location>,$<repos_url>,$<created_at>) ON CONFLICT (username) DO UPDATE' +
        ' SET profile_url = $<profile_url>, location = $<location>, repos_url = $<repos_url>, created_at = $<created_at> RETURNING username',
      user,
    );
    return username;
  } catch (error) {
    logger.error('Failed to create user' + error);
    return new Error('Failed to create user');
  }
}

export async function getUserByUsername(
  username: string,
): Promise<User | Error> {
  try {
    const user = await db.oneOrNone(
      'SELECT username,profile_url,location,repos_url,created_at FROM Users WHERE username = $1',
      username,
    );

    return user;
  } catch (error) {
    logger.error('Failed to get user. Error: ' + error);
    return new Error('Failed to get user');
  }
}

export async function getUserByLocation(
  location: string,
): Promise<User[] | Error> {
  try {
    const users = await db.manyOrNone(
      'SELECT username,profile_url,location,repos_url,created_at FROM Users WHERE location = $1',
      location,
    );
    return users;
  } catch (error) {
    logger.error('Failed to get users. Error: ' + error);
    return new Error('Failed to get users');
  }
}

export async function getAllUsers(): Promise<User[] | Error> {
  try {
    const users = await db.manyOrNone(
      'SELECT username,profile_url,location,repos_url,created_at FROM Users',
    );
    return users;
  } catch (error) {
    logger.error('Failed to get users from database. Error: ' + error);
    return new Error('Failed to get users from database');
  }
}

export async function getUserByProgrammingLanguage(
  programmingLanguage: string,
): Promise<User[] | Error> {
  try {
    const users = await db.manyOrNone(
      'SELECT username,profile_url,location,repos_url,created_at FROM Users WHERE username IN (SELECT username FROM User_Programming_Languages WHERE language_name = $1)',
      programmingLanguage,
    );
    return users;
  } catch (error) {
    logger.error('Failed to get users from database. Error: ' + error);
    return new Error('Failed to get users from database');
  }
}
