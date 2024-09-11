import { createCli } from '../../presentation/cli';
import { createUser, User } from '../../database/user';
import { db } from '../../database/database-connection';

describe('e2e', () => {
  describe('cli ', () => {
    beforeEach(async () => {
      await db.none('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
      await db.none(
        'TRUNCATE TABLE user_programming_languages RESTART IDENTITY CASCADE',
      );
    });

    test('should load user from github', async () => {
      const result = await createCli({ fetch: 'cfsgoncalves' });

      expect((result as User).username).toEqual('cfsgoncalves');
      expect((result as User).location).toEqual('Guimarães, Portugal');
      expect((result as User).profile_url).toEqual(
        'https://github.com/cfsgoncalves',
      );
      expect((result as User).repos_url).toEqual(
        'https://api.github.com/users/cfsgoncalves/repos',
      );
    });

    test('should load user from database', async () => {
      const user = await createUser({
        username: 'cfsgoncalves',
        profile_url: 'https://github.com/cfsgoncalves',
        location: 'Guimarães, Portugal',
        repos_url: 'https://api.github.com/users/cfsgoncalves/repos',
        created_at: new Date('2024-09-11T21:29:06.362Z'),
      });

      expect(user).toEqual({ username: 'cfsgoncalves' });

      const result = await createCli({ fetch: 'cfsgoncalves' });

      expect((result as User).username).toEqual('cfsgoncalves');
      expect((result as User).location).toEqual('Guimarães, Portugal');
      expect((result as User).profile_url).toEqual(
        'https://github.com/cfsgoncalves',
      );
      expect((result as User).repos_url).toEqual(
        'https://api.github.com/users/cfsgoncalves/repos',
      );
    });

    test('should load all users from database', async () => {
      const user = await createUser({
        username: 'cfsgoncalves',
        profile_url: 'test',
        location: 'test',
        repos_url: 'test',
        created_at: new Date('2024-09-11T21:29:06.362Z'),
      });

      expect(user).toEqual({ username: 'cfsgoncalves' });

      const result = await createCli({ displayAll: true });

      expect((result as User[])[0].username).toEqual('cfsgoncalves');
      expect((result as User[])[0].location).toEqual('test');
      expect((result as User[])[0].profile_url).toEqual('test');
      expect((result as User[])[0].repos_url).toEqual('test');
      expect((result as User[])[0].created_at).toEqual(
        new Date('2024-09-11T21:29:06.362Z'),
      );
    });

    test('should load user from location', async () => {
      const user = await createUser({
        username: 'cfsgoncalves',
        profile_url: 'test',
        location: 'Guimarães, Portugal',
        repos_url: 'test',
        created_at: new Date('2024-09-11T21:29:06.362Z'),
      });

      expect(user).toEqual({ username: 'cfsgoncalves' });

      const user2 = await createUser({
        username: 'tgcepeda',
        profile_url: 'test',
        location: 'Paris, France',
        repos_url: 'test',
        created_at: new Date('2024-09-11T21:29:06.362Z'),
      });

      expect(user2).toEqual({ username: 'tgcepeda' });

      const result = await createCli({ location: 'Portugal' });

      expect((result as User[])[0].username).toEqual('cfsgoncalves');
      expect((result as User[])[0].location).toEqual('Guimarães, Portugal');
      expect((result as User[])[0].profile_url).toEqual('test');
      expect((result as User[])[0].repos_url).toEqual('test');
      expect((result as User[])[0].created_at).toEqual(
        new Date('2024-09-11T21:29:06.362Z'),
      );
    });

    test('should load user that uses a programming language', async () => {
      const result = await createCli({ fetch: 'cfsgoncalves' });

      expect((result as User).username).toEqual('cfsgoncalves');

      const result2 = await createCli({ fetch: 'tchaguitos' });

      expect((result2 as User).username).toEqual('tchaguitos');

      const result3 = await createCli({ programmingLanguage: 'Go' });

      expect((result3 as User[])[0].username).toEqual('cfsgoncalves');
    });

    test('should load user that uses a programming language and has a location from database', async () => {
      const result = await createCli({ fetch: 'cfsgoncalves' });

      expect((result as User).username).toEqual('cfsgoncalves');

      const result2 = await createCli({ fetch: 'tchaguitos' });

      expect((result2 as User).username).toEqual('tchaguitos');

      const result3 = await createCli({
        programmingLanguage: 'Python',
        location: 'Portugal',
      });

      expect((result3 as User[])[0].username).toEqual('cfsgoncalves');
    });
  });
});
