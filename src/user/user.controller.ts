import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/role-auth.decorator';
import { RoleGuard } from 'src/auth/guards/jwt-role.guard';

@Controller('user')
export class UserController {
    
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    create(@Body() userDto: CreateUserDTO) {
        return this.userService.createUser(userDto);
    }

    @Roles('admin', 'moder')
    @UseGuards(RoleGuard)
    @Get('/getall')
    getAllUsers() {
        return this.userService.getAllUsers();
    }
}
