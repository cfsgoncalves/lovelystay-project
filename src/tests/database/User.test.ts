import { db } from '../../database/database-connection';
import { createProgrammingLanguageIfNotExists } from '../../database/models/programming-languages';
import {
  createUser,
  getUserByUsername,
  getUserByLocation,
  getAllUsers,
  getUserByProgrammingLanguage,
  User,
} from '../../database/models/user';

afterEach(async () => {
  await db.none('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  await db.none(
    'TRUNCATE TABLE user_programming_languages RESTART IDENTITY CASCADE',
  );
});

describe('integration', () => {
  describe('createUser', () => {
    test('should create a user', async () => {
      const user = {
        username: 'test',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/test/repos',
        created_at: new Date(),
      };
      const result = await createUser(user);

      expect(result).toEqual({ username: 'test' });

      const userDB = await getUserByUsername('test');

      expect((userDB as User).username).toEqual(user.username);
      expect((userDB as User).location).toEqual(user.location);
      expect((userDB as User).profile_url).toEqual(user.profile_url);
      expect((userDB as User).repos_url).toEqual(user.repos_url);
    });

    test('should update a user', async () => {
      const user = {
        username: 'test',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/test/repos',
        created_at: new Date(),
      };

      let result = await createUser(user);

      expect(result).toEqual({ username: 'test' });

      result = await createUser({ ...user, location: 'test2' });

      expect(result).toEqual({ username: 'test' });

      const userDB = await getUserByUsername('test');

      expect((userDB as User).location).toEqual('test2');
    });
  });

  describe('getUserByLocation', () => {
    test('should select a user by location', async () => {
      const user = {
        username: 'test3',
        profile_url: 'test',
        location: 'PT',
        repos_url: 'https://api.github.com/users/test/repos',
        created_at: new Date(),
      };

      const user2 = {
        username: 'test2',
        profile_url: 'test',
        location: 'ENG',
        repos_url: 'https://api.github.com/users/test2/repos',
        created_at: new Date(),
      };

      let result = await createUser(user);

      expect(result).toEqual({ username: 'test3' });

      result = await createUser(user2);

      expect(result).toEqual({ username: 'test2' });

      const usersDB = await getUserByLocation('PT');

      expect(usersDB).toEqual([user]);
    });
  });

  describe('getAllUsers', () => {
    test('should select all users', async () => {
      const user = {
        username: 'test',
        profile_url: 'test',
        location: 'PT',
        repos_url: 'https://api.github.com/users/test/repos',
        created_at: new Date(),
      };

      const user2 = {
        username: 'test2',
        profile_url: 'test',
        location: 'ENG',
        repos_url: 'https://api.github.com/users/test2/repos',
        created_at: new Date(),
      };

      let result = await createUser(user);

      expect(result).toEqual({ username: 'test' });

      result = await createUser(user2);

      expect(result).toEqual({ username: 'test2' });

      const users = await getAllUsers();

      expect(users).toEqual([user, user2]);
    });
  });

  describe('getUserByProgrammingLanguage', () => {
    test('should select a user by programming language', async () => {
      const user = {
        username: 'test',
        profile_url: 'test',
        location: 'PT',
        repos_url: 'https://api.github.com/users/test/repos',
        created_at: new Date(),
      };

      const user2 = {
        username: 'test1',
        profile_url: 'test',
        location: 'ENG',
        repos_url: 'https://api.github.com/users/test1/repos',
        created_at: new Date(),
      };

      let result = await createUser(user);

      expect(result).toEqual({ username: 'test' });

      result = await createUser(user2);

      expect(result).toEqual({ username: 'test1' });

      const userProgrammingLanguage = [
        {
          username: 'test',
          language_name: 'Java',
        },
        {
          username: 'test',
          language_name: 'Python',
        },
        {
          username: 'test1',
          language_name: 'Python',
        },
      ];

      const value = await createProgrammingLanguageIfNotExists(
        userProgrammingLanguage,
      );

      expect(value).toEqual(userProgrammingLanguage);

      const users = await getUserByProgrammingLanguage('Java');

      expect(users).toEqual([user]);
    });
  });
});

describe('unit', () => {
  describe('createUser', () => {
    test('should fail to create a user', async () => {
      db.one = jest.fn().mockRejectedValue(new Error('Failed to create user'));

      const user = {
        username: 'test',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/test/repos',
        created_at: new Date(),
      };

      const result = await createUser(user);

      expect(result).toEqual(new Error('Failed to create user'));
    });
  });

  describe('getUserByUsername', () => {
    test('should fail to get a user by username', async () => {
      db.oneOrNone = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get user'));

      const result = await getUserByUsername('test');

      expect(result).toEqual(new Error('Failed to get user'));
    });
  });

  describe('getUserByLocation', () => {
    test('should fail to get users by location', async () => {
      db.manyOrNone = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get users'));

      const result = await getUserByLocation('test');

      expect(result).toEqual(new Error('Failed to get users'));
    });
  });

  describe('getAllUsers', () => {
    test('should fail to get all users', async () => {
      db.manyOrNone = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get users'));

      const result = await getAllUsers();

      expect(result).toEqual(new Error('Failed to get users from database'));
    });
  });

  describe('getUserByProgrammingLanguage', () => {
    test('should fail to get users by programming language', async () => {
      db.manyOrNone = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get users from database'));

      const result = await getUserByProgrammingLanguage('test');

      expect(result).toEqual(new Error('Failed to get users from database'));
    });
  });
});
