import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { User } from '../user/schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration/configuration';

const mockUserData: CreateUserDTO = { name: 'Test', access_token: '' };
const mockUser: User = {
    _id: 'asd' as unknown as mongoose.Types.ObjectId,
    name: 'Test',
    access_token: 'Token',
};

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let configurationService: ConfigurationService;
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
            ],
            providers: [
                AuthService,
                UserService,
                JwtService,
                ConfigurationService,
                {
                    provide: getModelToken('User'),
                    useValue: userModel,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        configurationService =
            module.get<ConfigurationService>(ConfigurationService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should login a user', async () => {
        const decodedAuth = { exp: 'exp', sub: 'Test' };
        jest.spyOn(userService, 'findUserByName').mockResolvedValue(mockUser);
        jest.spyOn(jwtService, 'decode').mockReturnValue(decodedAuth);
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
        jest.spyOn(userService, 'updateUserToken').mockResolvedValue({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 1,
        } as any);
        const response = await authService.registerLogin(mockUserData);

        expect(response).toStrictEqual({
            access_token: 'token',
            msg: 'Logged In Successfully',
            error: false,
        });
    });

    it('should register a user', async () => {
        jest.spyOn(userService, 'findUserByName').mockResolvedValue(undefined);
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
        jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

        const response = await authService.registerLogin(mockUserData);

        expect(response).toStrictEqual({
            access_token: 'token',
            msg: 'User Registered Successfully',
            error: false,
        });
    });
});
