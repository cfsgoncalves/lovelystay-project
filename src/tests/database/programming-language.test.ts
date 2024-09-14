import { db } from '../../database/database-connection';
import { createUser } from '../../database/models/user';
import {
  createProgrammingLanguageIfNotExists,
  getProgrammingLanguagesByUsername,
} from '../../database/models/programming-languages';

afterEach(async () => {
  await db.none('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  await db.none(
    'TRUNCATE TABLE user_programming_languages RESTART IDENTITY CASCADE',
  );
});

describe('integration', () => {
  describe('createProgrammingLanguageIfNotExists', () => {
    test('should insert into multiple programming languages', async () => {
      const user = await createUser({
        username: 'test',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/test/repos',
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

  describe('getProgrammingLanguagesByUsername', () => {
    test('should return an array of programming languages', async () => {
      const user = await createUser({
        username: 'test',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/test/repos',
        created_at: new Date(),
      });

      expect(user).toEqual({ username: 'test' });

      const plArray = [
        { username: 'test', language_name: 'Python' },
        { username: 'test', language_name: 'JavaScript' },
        { username: 'test', language_name: 'Java' },
      ];

      await createProgrammingLanguageIfNotExists(plArray);

      const dbData = await getProgrammingLanguagesByUsername('test');

      expect(dbData).toContainEqual(plArray[0]);
      expect(dbData).toContainEqual(plArray[1]);
      expect(dbData).toContainEqual(plArray[2]);
    });
  });
});

describe('unit', () => {
  describe('createProgrammingLanguageIfNotExists', () => {
    test('should return an error if the insert fails', async () => {
      jest
        .spyOn(db, 'tx')
        .mockRejectedValue(new Error('Failed to insert programming languages'));

      const dbData = await createProgrammingLanguageIfNotExists([
        { username: 'test', language_name: 'Python' },
      ]);

      expect(dbData).toBeInstanceOf(Error);
      expect(dbData).toEqual(
        new Error('Failed to insert into user_programming_languages'),
      );
    });
  });

  describe('getProgrammingLanguagesByUsername', () => {
    test('should return an error if the query fails', async () => {
      jest
        .spyOn(db, 'manyOrNone')
        .mockRejectedValue(
          new Error('Failed to get programming languages by username'),
        );

      const dbData = await getProgrammingLanguagesByUsername('test');

      expect(dbData).toBeInstanceOf(Error);
      expect(dbData).toEqual(
        new Error('Failed to get programming languages by username'),
      );
    });
  });
});
