import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

const mockUser = { name: 'Test', access_token: 'Token' };
describe('UserService', () => {
    let userService: UserService;
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken('User'),
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockUser),
                        constructor: jest.fn().mockResolvedValue(mockUser),
                        find: jest.fn(),
                        create: jest.fn(),
                        exec: jest.fn(),
                        updateOne: jest.fn(),
                        findOne: jest.fn()
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userModel = module.get<Model<User>>(getModelToken('User'));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    // test to create a user
    it('should create a user', async () => {
        jest.spyOn(userModel, 'create').mockImplementationOnce(() =>
            Promise.resolve({ name: 'Test', access_token: 'Token' } as any),
        );
        const newUser = await userService.createUser({
            name: 'Test',
            access_token: 'Token',
        });
        expect(newUser).toEqual(mockUser);
    });

    it('should update the user access token', async () => {
        jest.spyOn(userModel, 'updateOne').mockReturnValueOnce({
            exec: jest.fn().mockResolvedValueOnce({
                acknowledged: true,
                matchedCount: 1,
                modifiedCount: 1,
            }),
        } as any);

        const result = await userService.updateUserToken(mockUser);
        expect(result).toEqual({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 1,
        });
    });

    it('should return a user from name', async () => {
        jest.spyOn(userModel, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(mockUser),
        } as any);

        const user = await userService.findUserByName('Test');
        // console.log(us)
        expect(user).toEqual(mockUser);
    });
});
