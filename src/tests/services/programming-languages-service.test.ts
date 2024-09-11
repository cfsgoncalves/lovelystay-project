import { db } from '../../database/database-connection';
import { fetchProgrammingLanguagesFromGithub } from '../../services/programming-language-service';
import { createUser } from '../../database/user';
import { getProgrammingLanguagesByUsername } from '../../database/programming-languages';

describe('integration', () => {
  afterEach(() => {
    db.none(
      "DELETE FROM public.user_programming_languages WHERE username LIKE 'cfsgoncalves'",
    );
    db.none("DELETE FROM public.users WHERE username LIKE 'cfsgoncalves'");
  });

  describe('fetchProgrammingLanguagesFromGithub', () => {
    test('happy_path', async () => {
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
