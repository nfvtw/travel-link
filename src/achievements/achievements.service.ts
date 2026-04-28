import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Achievements } from './achievements.model';
import { LEVEL_REQUIREMENTS } from 'check-level';
import { User } from 'src/user/user.model';

@Injectable()
export class AchievementsService {

    constructor(@InjectModel(Achievements) private achievementRepository: typeof Achievements,
                @InjectModel(User) private userRepository: typeof User) {}


    async create(id_owner: number) {
        try {

            const achievement = await this.achievementRepository.create({ id_owner })

            return achievement;

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async checkLevelUp(id: number) {
        try {
            console.log(2)
            const user = await this.userRepository.findByPk(id);
            if (!user) {
                throw new BadRequestException(`No user with id: ${id}`)
            }
            const stats = await this.achievementRepository.findOne({
                where: { id_owner: id },
            });
            if (!stats) {
                throw new BadRequestException(`No stats for user with id: ${id}`)
            }

            const statsData = stats.get({ plain: true });

            const nextLevel = Number(user.get('level')) + 1; 
            console.log(3, nextLevel)
            const requirements = LEVEL_REQUIREMENTS[nextLevel];

            console.log(requirements)
            console.log(stats)


            if (!requirements) return;

            const isCompleted = Object.keys(requirements).every(key => {
                return statsData[key] >= requirements[key];
            });

            
            console.log(isCompleted, "OR NOT")


            if (isCompleted) {
                await this.userRepository.update(
                    { level: nextLevel }, 
                    { where: { id: id } }
                );
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}
