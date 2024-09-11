
import { db } from '../../database/database-connection';
import { createUser } from '../../database/user';
import { createProgrammingLanguageIfNotExists } from '../../database/programming-languages';

describe('integration', () => {
  afterEach(() => {
    db.none(
      "DELETE FROM public.user_programming_languages WHERE username LIKE 'test%'",
    );
    db.none("DELETE FROM public.users WHERE username LIKE 'test%'");
  });

  describe('createProgrammingLanguageIfNotExists', () => {
    test('should insert into multiple programming languages', async () => {
      const user = await createUser({
        username: 'test',
        profile_url: 'test',
        location: 'test',
        repos_url: 'test',
        created_at: new Date(),
      });

      expect(user).toEqual({ username: 'test' });

      const plArray = [
        { username: 'test', language_name: 'Python' },
        { username: 'test', language_name: 'JavaScript' },
        { username: 'test', language_name: 'Java' },
      ];

      const dbData = await createProgrammingLanguageIfNotExists(plArray);

      expect(dbData).toContain(plArray[0]);
      expect(dbData).toContain(plArray[1]);
      expect(dbData).toContain(plArray[2]);
    });
  });
});
