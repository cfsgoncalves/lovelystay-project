import {
  createProgrammingLanguageIfNotExists,
  getProgrammingLanguagesByUsername,
} from '../database/models/programming-languages';
import { logger } from '../utils/logger';
import { ProgrammingLanguage } from '../database/models/programming-languages';

export interface UserWithProgrammingLanguages {
  username: string;
  programmingLanguages: ProgrammingLanguage[];
}

export async function fetchProgrammingLanguagesFromGithub(
  username: string,
): Promise<ProgrammingLanguage[] | Error> {
  //If api calls become expensive, either in money or in rate limits, we can use the same logic that
  //we used in `isUserUpdated` to only fetch the values if a delta has passed since the last time we fetched the values
  const programmingLanguages = new Set<string>();

  const githubUserUrl = process.env.GITHUB_USER_URL;
  const response = await fetch(githubUserUrl + '/' + username + '/repos');

  if (response.status !== 200) {
    logger.error(
      'Failed to fetch user from github with status code: ' + response.status,
    );
    return new Error(
      'Failed to fetch user from github with status code: ' + response.status,
    );
  }
  const repos = await response.json();

  for (const repo of repos) {
    if (repo.language === null) {
      continue;
    }

    const language: string = repo.language;
    programmingLanguages.add(language);
  }

  const array: string[] = [...programmingLanguages];

  const input = array.map((language) => ({
    username,
    language_name: language,
  }));

  const value = await createProgrammingLanguageIfNotExists(input);

  return value;
}

export async function displayProgrammingLanguagesByUsername(
  user: string,
): Promise<UserWithProgrammingLanguages | Error> {
  const programmingLanguages = await getProgrammingLanguagesByUsername(user);

  if (programmingLanguages instanceof Error) {
    logger.error('Failed to get programming languages from database');
    return programmingLanguages;
  }

  return {
    username: user,
    programmingLanguages,
  };
}
