import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor (private authService: AuthService) {}

    @Post('/login')
    login(@Body() userDto: LoginUserDto) {
        console.log(userDto);
        return this.authService.login(userDto);
    }

    @Post('/registration')
    registration(@Body() userDto: CreateUserDTO) {
        return this.authService.registration(userDto);
    }
}
