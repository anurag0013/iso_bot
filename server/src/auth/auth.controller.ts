import {
    Body,
    Controller,
    Get,
    Post,
    HttpCode,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    

    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post()
    async registerLogin(
        @Body() user: CreateUserDTO,
    ): Promise<HttpException | Object> {
        return await this.authService.registerLogin(user);
    }
}
