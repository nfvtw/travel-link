import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { Achievements } from 'src/achievements/achievements.model';

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Achievements) private achievementsRepository: typeof Achievements) {}

    async createUser(dto: CreateUserDTO) {
        const user = await this.userRepository.create(dto);
        console.log(user.dataValues)
        const achievement = await this.achievementsRepository.create({ id_owner: user.dataValues.id })
        return user;
    }

    
    async getAllUsers() {
        const users = await this.userRepository.findAll();
        return users;
    }

    async changeRole() {
        
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email }
        });
        return user;
    }

}
