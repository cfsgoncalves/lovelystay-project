import {
  displayAllUsersFromDatabase,
  fetchUserFromGithub,
} from '../../services/user-service';
import { db } from '../../database/database-connection';
import { createUser, getUserByUsername, User } from '../../database/user';
import * as moduleUser from '../../database/user';

describe('integration', () => {
  describe('fetchUserFromGithub', () => {
    afterEach(() => {
      db.none("DELETE FROM public.users WHERE username = 'fooo'");
      db.none("DELETE FROM public.users WHERE username = 'cfsgoncalves'");
    });

    test('happy_path', async () => {
      const user: User | Error = await fetchUserFromGithub('cfsgoncalves');

      expect((user as User).username).toContain('cfsgoncalves');
      expect((user as User).location).toContain('Guimarães, Portugal');
      expect((user as User).profile_url).toContain(
        'https://github.com/cfsgoncalves',
      );
      expect((user as User).repos_url).toContain(
        'https://api.github.com/users/cfsgoncalves/repos',
      );

      const userFromDB = await getUserByUsername('cfsgoncalves');

      expect(userFromDB).toEqual(user);
    });

    test('should not update user on the database', async () => {
      const dbUser = await moduleUser.createUser({
        username: 'cfsgoncalves',
        profile_url: 'fooo',
        location: 'barr',
        repos_url: 'sss',
        created_at: new Date(),
      });

      expect(dbUser).toEqual({ username: 'cfsgoncalves' });

      jest.spyOn(moduleUser, 'createUser');

      const user: User | Error = await fetchUserFromGithub('cfsgoncalves');

      expect((user as User).username).toContain('cfsgoncalves');

      expect(moduleUser.createUser).toHaveBeenCalledTimes(0);
    });

    test('user_update', async () => {
      jest.spyOn(moduleUser, 'createUser');

      const dbUser = await moduleUser.createUser({
        username: 'cfsgoncalves',
        profile_url: 'fooo',
        location: 'barr',
        repos_url: 'sss',
        created_at: new Date('2021-01-01'),
      });

      expect(dbUser).toEqual({ username: 'cfsgoncalves' });

      const user: User | Error = await fetchUserFromGithub('cfsgoncalves');

      expect((user as User).username).toContain('cfsgoncalves');
      expect((user as User).location).toContain('Guimarães, Portugal');
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
        repos_url: 'test',
        created_at: new Date(),
      });

      expect(user1).toEqual({ username: 'cfsgoncalves' });

      const user2 = await createUser({
        username: 'fooo',
        profile_url: 'test',
        location: 'test',
        repos_url: 'test',
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
  describe('fetchUserFromGithub', () => {
    test('should return user', async () => {});

    test('failed_fetch', async () => {});

    test('failed_create', async () => {});
  });
});
