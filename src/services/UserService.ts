import fetch from 'node-fetch';
import { env } from 'node:process';
import { createUser, User } from '../database/user';
import { logger } from '../utils/logger';

async function fetchUserFromGithub(username: string){
    const githubUserUrl = env.GITHUB_USER_URL;

    try {
        const {login, html_url, location, repos_url} : any= await fetch(githubUserUrl + "/" + username);
        const user: User = {
            username: login,
            profile_url: html_url,
            location: location || 'Unknown',
            repos_url: repos_url
        };
        const sucess = await createUser(user);
    }catch(error){
        logger.error('Error fetching user: ' + error);
    }
}



