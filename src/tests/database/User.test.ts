import { db } from "../../database/database-connection";
import { createUser, getUserByUsername, getUserByLocation } from "../../database/user";

describe('integration', () => {
    afterEach(() => {
        db.none("DELETE FROM public.users WHERE username LIKE 'test%'");
    });

    describe('createUser', () => {
        test('should create a user', async () => {
            const user = {
                username: 'test',
                profile_url: 'test',
                location: 'test',
                repos_url: 'test',
                created_at: new Date()
            }
            const result = await createUser(user);
        
            expect(result).toEqual({"username": "test"});    

            const userDB = await getUserByUsername('test')

            expect(userDB).toEqual(user)
        });
    });

    describe('getUserByLocation', () => {

        test('should select a user by location', async () => { 
            const user = {
                username: 'test',
                profile_url: 'test',
                location: 'PT',
                repos_url: 'test',
                created_at: new Date()
            }

            const user2 = {
                username: 'test2',
                profile_url: 'test',
                location: 'ENG',
                repos_url: 'test',
                created_at: new Date()
            }

            let result = await createUser(user);

            expect(result).toEqual({"username": "test"});

            result = await createUser(user2);

            expect(result).toEqual({"username": "test2"});

            const usersDB = await getUserByLocation('PT')

            expect(usersDB).toEqual([user])
        });
    });
});

describe('unit', () => {
    test('should create a user', async () => {          
        jest.spyOn(db, 'one').mockResolvedValue('test');

        const user = {
            username: 'test',
            profile_url: 'test',
            location: 'test',
            repos_url: 'test',
            created_at: new Date()
        }
        const result = await createUser(user);
    
        expect(result).toEqual('test');    
    });

    test('should fail to create a user', async () => {
        jest.spyOn(db, 'one').mockResolvedValue(new Error('Failed to create user'));

        const user = {
            username: 'test',
            profile_url: 'test',
            location: 'test',
            repos_url: 'test',
            created_at: new Date()
        }

        const result = await createUser(user);
    
        expect(result).toEqual(new Error('Failed to create user'));        
    });
});