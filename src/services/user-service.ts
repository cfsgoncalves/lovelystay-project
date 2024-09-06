import { env } from 'node:process';
import { createUser, User, getAllUsers, getUserByLocation, getUserByUsername } from '../database/user';
import { logger } from '../utils/logger';

export async function fetchUserFromGithub(username: string): Promise<User | Error> {
    // Add timestamp for user to refresh data
    const userFromDB: User | Error = await getUserByUsername(username)

    const TIME_TO_REFRESH = Number(env.TIME_TO_REFRESH) ?? 86400000; // 1 day
    
    console.log((userFromDB as User)?.created_at && (userFromDB as User).created_at.getTime())
    console.log(Date.now() - Number(env.TIME_TO_REFRESH ?? 0))

    const addUpdateUserDBCondition = (userFromDB as User)?.created_at && new Date((userFromDB as User).created_at.getTime()) < new Date(Date.now() - TIME_TO_REFRESH);

    if (userFromDB instanceof Error || addUpdateUserDBCondition) {
        console.log("entra")
        return userFromDB
    }

    const githubUserUrl = env.GITHUB_USER_URL;

    const response = await fetch(githubUserUrl + "/" + username);
    if (response.status !== 200) {
        logger.error('Failed to fetch user from github with status code: ' + response.status);
        return new Error('Failed to fetch user from github with status code: ' + response.status);
    }

    const {login, html_url, location, repos_url} : any=  await response.json();

    const user: User = {
        username: login,
        profile_url: html_url,
        location: location || 'Unknown',
        repos_url: repos_url,
        created_at: new Date()
    };

    const sucess = await createUser(user);
    if(!sucess){
        logger.error('Failed to create user');
        return new Error('Failed to create user');
    }

    return user;
}

export async function displayAllUsersFromDatabase(): Promise<User[] | Error> {
    const users = await getAllUsers();
    if (users instanceof Error) {
        logger.error('Failed to get users from database');
        return new Error('Failed to get users from database');
    }
    return users;
};





