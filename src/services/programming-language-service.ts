import { createProgrammingLanguageIfNotExists } from "../database/programming-languages";
import { logger } from "../utils/logger";
import { ProgrammingLanguage } from "../database/programming-languages";

export async function fetchProgrammingLanguagesFromGithub(username: string): Promise<ProgrammingLanguage[] | Error> {
    const programmingLanguages = new Set<string>();

    const githubUserUrl = process.env.GITHUB_USER_URL;
    const response = await fetch(githubUserUrl + "/" + username + "/repos");

    if (response.status !== 200) {
        logger.error('Failed to fetch user from github with status code: ' + response.status);
        return new Error('Failed to fetch user from github with status code: ' + response.status);
    }
    const repos: any[] = await response.json();

    for (const repo of repos) {
        if (repo.language === null) {
            continue
        }

        const language: string = repo.language;
        programmingLanguages.add(language);
    }

    const array: string[] = [...programmingLanguages];

    const input = array.map(language => ({username, language_name: language}));
    

    const value = await createProgrammingLanguageIfNotExists(input);

    return value;    
}

