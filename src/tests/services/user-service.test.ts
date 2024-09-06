import { displayAllUsersFromDatabase, fetchUserFromGithub } from "../../services/user-service";
import { db } from "../../database/database-connection";
import { getUserByUsername, User } from "../../database/user";
import * as moduleUser from "../../database/user";


describe('integration', () => {
    afterEach(() => {
        db.none("DELETE FROM public.users WHERE username LIKE 'cfsgoncalves'");
    });

    describe('fetchUserFromGithub', () => {
        test('happy_path', async () => {
            const user: User | Error = await fetchUserFromGithub('cfsgoncalves');

            expect((user as User).username).toContain('cfsgoncalves');
            expect((user as User).location).toContain('Guimarães, Portugal')
            expect((user as User).profile_url).toContain('https://github.com/cfsgoncalves')
            expect((user as User).repos_url).toContain('https://api.github.com/users/cfsgoncalves/repos')

            const userFromDB = await getUserByUsername('cfsgoncalves')

            expect(userFromDB).toEqual(user)
        });

        test('should not update user on the database', async () => {

            const dbUser = await moduleUser.createUser({
                username: "cfsgoncalves",
                profile_url: "fooo",
                location: "barr",
                repos_url: "sss",
                created_at: new Date()
            })

            expect(dbUser).not.toBeNull()

            console.log(JSON.stringify(dbUser))

            jest.spyOn(moduleUser, 'createUser')

            const user: User | Error = await fetchUserFromGithub('cfsgoncalves');

            expect((user as User).username).toContain('cfsgoncalves');

            expect(moduleUser.createUser).toHaveBeenCalledTimes(0);
        });

        test('user_update', async() => {
            jest.spyOn(moduleUser, 'createUser')
            
            jest.setSystemTime(new Date(2020, 3, 20))

            const user: User | Error = await fetchUserFromGithub('cfsgoncalves');

            expect((user as User).username).toContain('cfsgoncalves');
            expect((user as User).location).toContain('Guimarães, Portugal')
            expect((user as User).profile_url).toContain('https://github.com/cfsgoncalves')
            expect((user as User).repos_url).toContain('https://api.github.com/users/cfsgoncalves/repos')

            const userFromDB = await getUserByUsername('cfsgoncalves')

            expect(moduleUser.createUser).toHaveBeenCalled();
        });
    }); 

    describe('displayAllUsersFromDatabase', () => {
        test('happy_path', async () => {
            const user = await fetchUserFromGithub('cfsgoncalves');
            const users = await displayAllUsersFromDatabase();

            expect(users).toEqual([user]);
        });
    });
});


describe('unit', () => {
    describe('fetchUserFromGithub', () => {
        test('should return user', async () => {
        });

        test('failed_fetch', async () => {
        });

        test('failed_create', async () => {
        });
    });
});
  