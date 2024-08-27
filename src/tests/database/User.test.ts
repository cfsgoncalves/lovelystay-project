import { env } from "node:process";
import { db } from "../../database/databaseConnection";
import { createUser } from "../../database/user";
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

describe('integration', () => {
    describe('createUser', () => {
        test('should create a user', async () => {


        });

        test('should fail to create a user', async () => {


        });
    });

    describe('unit', () => {
        test('should create a user', async () => {            
            jest.spyOn(db, 'one').mockResolvedValue('test');

            const user = {
                username: 'test',
                profile_url: 'test',
                location: 'test',
                repos_url: 'test'
            }
            const result = await createUser(user);
        
            expect(result).toEqual('test');    
        });
    
        test('should fail to create a user', async () => {
            jest.spyOn(db, 'one').mockResolvedValue(null);

            const user = {
                username: 'test',
                profile_url: 'test',
                location: 'test',
                repos_url: 'test'
            }

            const result = await createUser(user);
        
            expect(result).toEqual(new Error('Failed to create user'));        
        });

    });
});

