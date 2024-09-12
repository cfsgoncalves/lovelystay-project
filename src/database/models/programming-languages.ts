import { logger } from '../../utils/logger';
import { db, pgp } from '../database-connection';

export interface ProgrammingLanguage {
  username: string;
  language_name: string;
}

export async function createProgrammingLanguageIfNotExists(
  pl: ProgrammingLanguage[],
): Promise<ProgrammingLanguage[] | Error> {
  try {
    const { ColumnSet, insert } = pgp.helpers;
    const cs = new ColumnSet(['username', 'language_name'], {
      table: 'user_programming_languages',
    });

    const query = insert(pl, cs) + ' ON CONFLICT DO NOTHING';

    await db.none(query);

    return pl;
  } catch (error) {
    logger.error('Failed to insert into user_programming_languages' + error);
    return new Error('Failed to insert into user_programming_languages');
  }
}

export async function getProgrammingLanguagesByUsername(
  username: string,
): Promise<ProgrammingLanguage[] | Error> {
  try {
    const pl = await db.manyOrNone(
      'SELECT * FROM user_programming_languages WHERE username = $1',
      username,
    );
    return pl;
  } catch (error) {
    logger.error('Failed to get programming languages by username' + error);
    return new Error('Failed to get programming languages by username');
  }
}
