import {
  displayAllUsersFromDatabase,
  displayUsersByLocation,
  displayUsersByProgrammingLanguage,
  fetchOrUpdateUserFromGithub,
} from '../../services/user-service';
import { db } from '../../database/database-connection';
import {
  createUser,
  getUserByUsername,
  User,
} from '../../database/models/user';
import * as moduleUser from '../../database/models/user';

afterEach(async () => {
  await db.none('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  await db.none(
    'TRUNCATE TABLE user_programming_languages RESTART IDENTITY CASCADE',
  );
});

describe('integration', () => {
  describe('fetchOrUpdateUserFromGithub', () => {
    test('happy_path', async () => {
      const user: User | Error =
        await fetchOrUpdateUserFromGithub('cfsgoncalves');

      expect((user as User).username).toContain('cfsgoncalves');
      expect((user as User).location).toContain('Guimarães, Portugal');
      expect((user as User).profile_url).toContain(
        'https://github.com/cfsgoncalves',
      );
      expect((user as User).repos_url).toContain(
        'https://api.github.com/users/cfsgoncalves/repos',
      );

      const userFromDB = await getUserByUsername('cfsgoncalves');

      expect((userFromDB as User).username).toEqual((user as User).username);
      expect((userFromDB as User).location).toEqual((user as User).location);
      expect((userFromDB as User).profile_url).toEqual(
        (user as User).profile_url,
      );
      expect((userFromDB as User).repos_url).toEqual((user as User).repos_url);
    });

    test('should not update user on the database', async () => {
      const dbUser = await moduleUser.createUser({
        username: 'cfsgoncalves',
        profile_url: 'fooo',
        location: 'barr',
        repos_url: 'https://api.github.com/users/cfsgoncalves/repos',
        created_at: new Date(),
      });

      expect(dbUser).toEqual({ username: 'cfsgoncalves' });

      jest.spyOn(moduleUser, 'createUser');

      const user: User | Error =
        await fetchOrUpdateUserFromGithub('cfsgoncalves');

      expect((user as User).username).toContain('cfsgoncalves');

      expect(moduleUser.createUser).toHaveBeenCalledTimes(0);
    });

    test('user_update', async () => {
      jest.spyOn(moduleUser, 'createUser');

      const dbUser = await moduleUser.createUser({
        username: 'cfsgoncalves',
        profile_url: 'https://github.com/cfsgoncalves',
        location: 'barr',
        repos_url: 'https://api.github.com/users/cfsgoncalves/repos',
        created_at: new Date('2021-01-01'),
      });

      expect(dbUser).toEqual({ username: 'cfsgoncalves' });

      const user: User | Error =
        await fetchOrUpdateUserFromGithub('cfsgoncalves');

      expect((user as User).username).toContain('cfsgoncalves');
      expect((user as User).location).toContain('barr');
      expect((user as User).profile_url).toContain(
        'https://github.com/cfsgoncalves',
      );
      expect((user as User).repos_url).toContain(
        'https://api.github.com/users/cfsgoncalves/repos',
      );

      const userFromDB = await getUserByUsername('cfsgoncalves');

      expect(userFromDB).toEqual(user);

      expect(moduleUser.createUser).toHaveBeenCalled();
    });
  });

  describe('displayAllUsersFromDatabase', () => {
    test('happy_path', async () => {
      const user1 = await createUser({
        username: 'cfsgoncalves',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/cfsgoncalves/repos',
        created_at: new Date(),
      });

      expect(user1).toEqual({ username: 'cfsgoncalves' });

      const user2 = await createUser({
        username: 'fooo',
        profile_url: 'test',
        location: 'test',
        repos_url: 'https://api.github.com/users/cfsgoncalves/repos',
        created_at: new Date(),
      });

      expect(user2).toEqual({ username: 'fooo' });

      const users = await displayAllUsersFromDatabase();

      expect((users as User[])[0].username).toEqual('cfsgoncalves');
      expect((users as User[])[1].username).toContain('fooo');
    });
  });
});

describe('unit', () => {
  describe('fetchOrUpdateUserFromGithub', () => {
    test('should return user', async () => {});

    test('failed_fetch', async () => {});

    test('failed_create', async () => {});
  });

  describe('displayAllUsersFromDatabase', () => {
    test('should fail to return users', async () => {
      jest.spyOn(moduleUser, 'getAllUsers').mockResolvedValue(new Error());

      const users = await displayAllUsersFromDatabase();

      expect(users).toEqual(
        new Error('Failed to display all users from database'),
      );
    });
  });

  describe('displayUsersByLocation', () => {
    test('should fail to return users by location', async () => {
      jest
        .spyOn(moduleUser, 'getUserByLocation')
        .mockResolvedValue(new Error());

      const users = await displayUsersByLocation('test');

      expect(users).toEqual(new Error('Failed to display users by location'));
    });
  });

  describe('displayUsersByProgrammingLanguage', () => {
    test('should fail to return users by programming language', async () => {
      jest
        .spyOn(moduleUser, 'getUserByProgrammingLanguage')
        .mockResolvedValue(new Error());

      const users = await displayUsersByProgrammingLanguage('test');

      expect(users).toEqual(
        new Error('Failed to display users by programming language'),
      );
    });
  });
});
