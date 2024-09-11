import { env } from 'node:process';
import {
  createUser,
  User,
  getAllUsers,
  getUserByLocation,
  getUserByUsername,
  getUserByProgrammingLanguage,
} from '../database/user';
import { logger } from '../utils/logger';

export async function fetchUserFromGithub(
  username: string,
): Promise<User | Error> {
  const userFromDB: User | Error = await getUserByUsername(username);

  const TIME_TO_REFRESH = Number(env.TIME_TO_REFRESH) || 86400000; // 1 day

  const dateNeedsToBeUpdated =
    new Date(Date.now() - TIME_TO_REFRESH) >=
    new Date((userFromDB as User)?.created_at);

  //Only update the user if the user is not in the database or if the user is in the database but is not updated in a delta period of time
  if (
    userFromDB instanceof Error ||
    (!dateNeedsToBeUpdated && userFromDB !== null)
  ) {
    return userFromDB;
  }

  const githubUserUrl = env.GITHUB_USER_URL;

  const response = await fetch(githubUserUrl + '/' + username);
  if (response.status !== 200) {
    logger.error(
      'Failed to fetch user from github with status code: ' + response.status,
    );
    return new Error(
      'Failed to fetch user from github with status code: ' + response.status,
    );
  }

  const { login, html_url, location, repos_url } = await response.json();

  const user: User = {
    username: login,
    profile_url: html_url,
    location: location || 'Unknown',
    repos_url: repos_url,
    created_at: new Date(),
  };

  const sucess = await createUser(user);
  if (!sucess) {
    logger.error('Failed to create user');
    return new Error('Failed to create user');
  }

  return user;
}

export async function displayAllUsersFromDatabase(): Promise<User[] | Error> {
  const users = await getAllUsers();
  if (users instanceof Error) {
    logger.error('Failed to display all users from database');
    return new Error('Failed to display all users from database');
  }
  return users;
}

export async function displayUsersByLocation(
  location: string,
): Promise<User[] | Error> {
  const users = await getUserByLocation(location);
  if (users instanceof Error) {
    logger.error('Failed to display users by location');
    return new Error('Failed to display users by location');
  }
  return users;
}

export async function displayUsersByProgrammingLanguage(
  programmingLanguage: string,
): Promise<User[] | Error> {
  const users = await getUserByProgrammingLanguage(programmingLanguage);
  if (users instanceof Error) {
    logger.error('Failed to display users by programming language');
    return new Error('Failed to display users by programming language');
  }
  return users;
}
