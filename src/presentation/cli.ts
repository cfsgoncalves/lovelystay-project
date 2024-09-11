import { Command } from 'commander';
import {
  displayAllUsersFromDatabase,
  displayUsersByLocation,
  displayUsersByProgrammingLanguage,
  fetchUserFromGithub,
} from '../services/user-service';
import { logger } from '../utils/logger';
import { fetchProgrammingLanguagesFromGithub } from '../services/programming-language-service';
import { User } from '../database/user';

export async function createCli() {
  const program = new Command();

  program
    .option('-f, --fetch <username>', 'fetch user from github')
    .option(
      '-d, --displayAll',
      'fetch and display all the users on the database',
    )
    .option('-l, --location <location>', 'list users from a given location')
    .option(
      '-pl, --programmingLanguage <programmingLanguage>',
      'query the users by programming language',
    );

  program.parse(process.argv);

  const options = program.opts();

  if (options.fetch) {
    logger.debug(`fetching user from github: ${options.fetch}`);
    return Promise.all([
      fetchUserFromGithub(options.fetch),
      fetchProgrammingLanguagesFromGithub(options.fetch),
    ]);
  }

  if (options.displayAll) {
    logger.debug(`displaying user from database: ${options.displayAll}`);
    return displayAllUsersFromDatabase().then((users) => {
      console.log(`Displaying all the users on the database:`);
      console.log(users)
    });
  }

  if(options.location && options.programmingLanguage) {
    logger.debug(`fetching user from location: ${options.location} and programming language: ${options.programmingLanguage}`);
    return
  }

  if (options.location) {
    logger.debug(`fetching user from location: ${options.location}`);
    return displayUsersByLocation(options.location).then((users) => {
      console.log(`Displaying all the users from the location ${options.location} are: \n`);
      console.log(users);
    });
  }

  if (options.programmingLanguage) {
    logger.debug("fetching user by programming language: " + options.programmingLanguage);
    return displayUsersByProgrammingLanguage(
      options.programmingLanguage,
    ).then((users) => {
      console.log(`Displaying all the for the programming language ${options.programmingLanguage} are: \n`);
      console.log(users);
    });
  }
}
