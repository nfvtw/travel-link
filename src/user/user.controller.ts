import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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

    @Roles('admin', 'moder', 'user')
    @UseGuards(RoleGuard)
    @Get('/getall')
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get/:id')
    getProfile(@Req() req: any, @Param('id') id_user: number) {
        const id_owner = req?.user.id ?? null;
        return this.userService.getInfoForUser(id_user, id_owner);
    }
}
