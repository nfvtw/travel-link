import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Liked } from './liked.model';
import { addLikedDto } from './dto/add-liked.dto';
import { Point } from 'src/point/point.model';
import { Route } from 'src/route/route.model';
import { Achievements } from 'src/achievements/achievements.model';
import { AchievementsService } from 'src/achievements/achievements.service';
import { User } from 'src/user/user.model';

@Injectable()
export class LikedService {

    constructor(@InjectModel(Liked) private likedRepository: typeof Liked,
                @InjectModel(User) private userRepository: typeof User,
                @InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(Route) private routeRepository: typeof Route,
                @InjectModel(Achievements) private achievementsRepository: typeof Achievements,
                private readonly achievementsService: AchievementsService) {}

    async addOrRemoveLiked(dto: addLikedDto, id_owner: number) {
try {
            const duplicateFavourite = await this.likedRepository.findOne({
                where: { id_owner, type_object: dto.type_object, id_object: dto.id_object }
            });
            if (duplicateFavourite) {
                await this.likedRepository.destroy({
                    where: { type_object: dto.type_object, 
                             id_owner, 
                             id_object: dto.id_object }
                })
                switch(dto.type_object) {
                    case 'point':
                        return {
                            message: "Точка успешно удалена из понравившегося"
                        }
                    case 'route':
                        return {
                            message: "Маршрут успешно удален из понравившегося"
                        }
                }
            }
            else {
                switch(dto.type_object) {
                    case 'point':
                        const point = await this.pointRepository.findByPk(dto.id_object);
                        if (!point) {
                            throw new BadRequestException("Выбранной точки не существует");
                        }
                        break;
                
                    case 'route':
                        const route = await this.routeRepository.findByPk(dto.id_object);
                        if (!route) {
                            throw new BadRequestException("Выбранного маршрута не существует");
                        }
                        

                        const routeOwner = await this.userRepository.findByPk(route.dataValues.id_owner)

                        if (!routeOwner) {
                            throw new BadRequestException('Владелец маршрута не найден');
                        }

                        await this.achievementsRepository.increment('posted_likes', {
                            by: 1,
                            where: { id_owner },
                        });

                        await this.achievementsService.checkLevelUp(id_owner);

                        await this.achievementsRepository.increment('received_likes', {
                            by: 1,
                            where: { id_owner: routeOwner?.id },
                        });

                        await this.achievementsService.checkLevelUp(routeOwner?.id);

                        break;
                    default: 
                        throw new BadRequestException("Выбранные тип объекта не поддерживается");
                }
                const favourite = await this.likedRepository.create({...dto, id_owner});
                return favourite;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
