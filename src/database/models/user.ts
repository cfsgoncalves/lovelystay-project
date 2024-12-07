import { logger } from '../../utils/logger';
import { db } from '../database-connection';
import { as } from 'pg-promise';
import z from 'zod';

export interface User {
  username: string;
  profile_url: string;
  location: string;
  repos_url: string;
  created_at: Date;
}

export async function createUser(user: User): Promise<Error | string> {
  const userSchema = z.object({
    username: z.string(),
    profile_url: z.string(),
    location: z.string(),
    repos_url: z.string().url(),
    created_at: z.date(),
  });

  try {
    userSchema.parse(user);
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
  const usernameSchema = z.string();

  try {
    usernameSchema.parse(username);
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
  const locationSchema = z.string();

  try {
    locationSchema.parse(location);
    const users = await db.manyOrNone(
      'SELECT username,profile_url,location,repos_url,created_at FROM Users WHERE location LIKE $1',
      as.format('%' + location + '%', as.value),
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
  const programmingLanguageSchema = z.string();

  try {
    programmingLanguageSchema.parse(programmingLanguage);
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

export async function getUserByLocationAndProgrammingLanguage(
  location: string,
  pl: string,
): Promise<User[] | Error> {
  const usernameSchema = z.string();
  const plSchema = z.string();

  try {
    usernameSchema.parse(location);
    plSchema.parse(pl);
    const users = await db.manyOrNone(
      'SELECT username,profile_url,location,repos_url,created_at FROM Users WHERE location LIKE $1 AND username IN (SELECT username FROM User_Programming_Languages WHERE language_name = $2)',
      [as.format('%' + location + '%', as.value), pl],
    );
    return users;
  } catch (error) {
    logger.error('Failed to get users from database. Error: ' + error);
    return new Error('Failed to get users from database');
  }
}
