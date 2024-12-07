import { Command, OptionValues } from 'commander';
import {
  displaUserByLocationAndProgrammingLanguage,
  displayAllUsersFromDatabase,
  displayUsersByLocation,
  displayUsersByProgrammingLanguage,
  fetchOrUpdateUserFromGithub,
} from '../services/user-service';
import { logger } from '../utils/logger';
import {
  displayProgrammingLanguagesByUsername,
  fetchProgrammingLanguagesFromGithub,
} from '../services/programming-language-service';

// An improvement here would be to separate each option in each own function
export async function createCli(optionsValue?: OptionValues) {
  const program = new Command();
  let options = optionsValue;

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
    )
    .option(
      '-s, --showProgrammingLanguages <username>',
      'show all the details of a user',
    );

  if (!optionsValue) {
    options = program.opts();
  }

  program.parse();

  if (options!.fetch) {
    logger.debug(`fetching user from github: ${options!.fetch}`);

    const [user] = await Promise.all([
      fetchOrUpdateUserFromGithub(options!.fetch),
      fetchProgrammingLanguagesFromGithub(options!.fetch),
    ]);

    return user;
  }

  if (options!.displayAll) {
    logger.debug(`displaying user from database: ${options!.displayAll}`);
    const users = await displayAllUsersFromDatabase();

    return users;
  }

  if (options!.location && options!.programmingLanguage) {
    logger.debug(
      `fetching user from location: ${options!.location} and programming language: ${options!.programmingLanguage}`,
    );
    const users = await displaUserByLocationAndProgrammingLanguage(
      options!.location,
      options!.programmingLanguage,
    );
    return users;
  }

  if (options!.location) {
    logger.debug(`fetching user from location: ${options!.location}`);
    const users = await displayUsersByLocation(options!.location);

    return users;
  }

  if (options!.programmingLanguage) {
    logger.debug(
      'fetching user by programming language: ' + options!.programmingLanguage,
    );
    const users = await displayUsersByProgrammingLanguage(
      options!.programmingLanguage,
    );
    return users;
  }

  if (options!.showProgrammingLanguages) {
    logger.debug(
      'showing programming languages of user: ' +
        options!.showProgrammingLanguages,
    );
    const users = await displayProgrammingLanguagesByUsername(
      options!.showProgrammingLanguages,
    );
    return users;
  }
}
