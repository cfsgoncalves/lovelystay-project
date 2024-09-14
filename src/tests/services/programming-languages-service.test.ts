import { fetchProgrammingLanguagesFromGithub } from '../../services/programming-language-service';
import { createUser } from '../../database/models/user';
import { getProgrammingLanguagesByUsername } from '../../database/models/programming-languages';
import { db } from '../../database/database-connection';

afterEach(async () => {
  await db.none('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  await db.none(
    'TRUNCATE TABLE user_programming_languages RESTART IDENTITY CASCADE',
  );
});

describe('integration', () => {
  describe('fetchProgrammingLanguagesFromGithub', () => {
    test('should return user from the db', async () => {
      const user = await createUser({
        username: 'cfsgoncalves',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/cfsgoncalves/repos',
        created_at: new Date(),
      });

      expect(user).toEqual({ username: 'cfsgoncalves' });

      const plgithub =
        await fetchProgrammingLanguagesFromGithub('cfsgoncalves');

      expect(plgithub).toEqual([
        {
          language_name: 'Java',
          username: 'cfsgoncalves',
        },
        {
          language_name: 'HTML',
          username: 'cfsgoncalves',
        },
        {
          language_name: 'Python',
          username: 'cfsgoncalves',
        },
        {
          language_name: 'Go',
          username: 'cfsgoncalves',
        },
        {
          language_name: 'JavaScript',
          username: 'cfsgoncalves',
        },
      ]);

      const pldb = await getProgrammingLanguagesByUsername('cfsgoncalves');

      expect(pldb).toContainEqual({
        language_name: 'Go',
        username: 'cfsgoncalves',
      });
      expect(pldb).toContainEqual({
        language_name: 'HTML',
        username: 'cfsgoncalves',
      });
      expect(pldb).toContainEqual({
        language_name: 'Java',
        username: 'cfsgoncalves',
      });
      expect(pldb).toContainEqual({
        language_name: 'JavaScript',
        username: 'cfsgoncalves',
      });
      expect(pldb).toContainEqual({
        language_name: 'Python',
        username: 'cfsgoncalves',
      });
    });
  });

  describe('displayProgrammingLanguagesByUsername', () => {
    test('should return an array of programming languages', async () => {
      const user = await createUser({
        username: 'cfsgoncalves',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/cfsgoncalves/repos',
        created_at: new Date(),
      });

      expect(user).toEqual({ username: 'cfsgoncalves' });

      const plArray = [
        { username: 'cfsgoncalves', language_name: 'Python' },
        { username: 'cfsgoncalves', language_name: 'JavaScript' },
        { username: 'cfsgoncalves', language_name: 'Java' },
      ];

      await db.none(
        'INSERT INTO user_programming_languages (username, language_name) VALUES ($1, $2), ($3, $4), ($5, $6)',
        [
          plArray[0].username,
          plArray[0].language_name,
          plArray[1].username,
          plArray[1].language_name,
          plArray[2].username,
          plArray[2].language_name,
        ],
      );

      const dbData = await getProgrammingLanguagesByUsername('cfsgoncalves');

      expect(dbData).toContainEqual(plArray[0]);
      expect(dbData).toContainEqual(plArray[1]);
      expect(dbData).toContainEqual(plArray[2]);
    });
  });
});
