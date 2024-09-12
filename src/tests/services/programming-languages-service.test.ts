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
        repos_url: 'test',
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
});
