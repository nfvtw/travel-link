import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/user/user.model';
import { LoginUserDto } from 'src/user/dto/login-user.dto';


@Injectable()
export class AuthService {

        constructor(private userService: UserService, private jwtService: JwtService) {}

        async login(dto: LoginUserDto) {
            console.log(dto);
            const user = await this.validateUser(dto);
            return this.generateToken(user);
        }
    
        async registration(dto: CreateUserDTO) {
            const candidate = await this.userService.getUserByEmail(dto.email);
            if (candidate) {
                throw new HttpException('Пользователь с такой почтой уже существует', HttpStatus.BAD_REQUEST)
            }
            const hashPassword = await bcrypt.hash(dto.password, 5);
            const user = await this.userService.createUser({...dto, password: hashPassword});
            return this.generateToken(user);
        }

        private async generateToken(user: User) {
            const payload = {
                id: user.dataValues.id,
                role: user.dataValues.role,
            }
            return {
                token: this.jwtService.sign(payload)
            }
        }

        private async validateUser(dto: LoginUserDto) {
            console.log(dto);
            const user = await this.userService.getUserByEmail(dto.email);
            if (!user) {
                throw new UnauthorizedException('Пользователь не зарегестрирован');
            }
            console.log(user);
            const passwordEquals = await bcrypt.compare(dto.password, user.dataValues.password)
            if (!passwordEquals) {
                throw new UnauthorizedException('Неверный пароль');
            }
            return user;
        }
}
