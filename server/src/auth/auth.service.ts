import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { ConfigurationService } from '../configuration/configuration.service';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configurationService: ConfigurationService,
    ) {}

    isTimestampWithin24Hours = (timestamp: number): Boolean => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return (
            currentTimestamp - 24 * 60 * 60 * 1000 <=
                timestamp - 15 * 60 * 1000 &&
            timestamp - 15 * 60 * 1000 <= currentTimestamp
        );
    };

    async registerLogin(user: CreateUserDTO): Promise<HttpException | Object> {
        const check_user = await this.userService.findUserByName(user.name);
        if (check_user) {
            const decodedJwt: JSON = this.jwtService.decode(
                check_user.access_token,
            ) as JSON;
            const expiryTime = decodedJwt['exp'];

            const developer_email = this.configurationService.getDeveloperEmail();

            if (
                developer_email.includes(user.name) &&
                this.isTimestampWithin24Hours(expiryTime)
            ) {
                return {
                    msg: 'Access not allowed within 24 hours',
                    error: true,
                };
            } else {
                const payload = { sub: user.name };
                const access_token = await this.jwtService.signAsync(payload);
                user.access_token = access_token;

                try {
                    await this.userService.updateUserToken(user);
                    return {
                        access_token: access_token,
                        msg: 'Logged In Successfully',
                        error: false,
                    };
                } catch (error) {
                    console.log(error)
                    throw new HttpException(
                        'Error while logging user',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            }
        } else {
            const payload = { sub: user.name };
            const access_token = await this.jwtService.signAsync(payload);
            user.access_token = access_token;

            try {
                await this.userService.createUser(user);
                return {
                    access_token: access_token,
                    msg: 'User Registered Successfully',
                    error: false,
                };
            } catch (error) {
                throw new HttpException(
                    'Error while creating user',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    public async getUserFromAuthenticationToken(
        token: string,
    ): Promise<User | undefined> {
        const payload = this.jwtService.verify(token, {
            secret: this.configurationService.getJwtSecret(),
        });

        const user = payload.sub;

        if (user) {
            return this.userService.findUserByName(user);
        }
    }
}
