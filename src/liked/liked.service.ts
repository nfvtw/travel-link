import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Liked } from './liked.model';
import { addLikedDto } from './dto/add-liked.dto';
import { Point } from 'src/point/point.model';
import { Route } from 'src/route/route.model';

@Injectable()
export class LikedService {

    constructor(@InjectModel(Liked) private likedRepository: typeof Liked) {}

    async addLiked(dto: addLikedDto, id_owner: number) {

        const duplicateLiked = await Liked.findOne({
            where: { id_owner, type_object: dto.type_object, id_object: dto.id_object }
        });
        if (duplicateLiked) {
            switch(dto.type_object) {
                case 'point':
                    throw new BadRequestException("Точка уже добавлена в понравившееся");
                case 'route':
                    throw new BadRequestException("Маршрут уже добавлен в понравившееся");
            }
        }

        switch(dto.type_object) {
            case 'point':
                const point = await Point.findByPk(dto.id_object);
                if (!point) {
                    throw new BadRequestException("Выбранной точки не существует");
                }
                break;

            case 'route':
                const route = await Route.findByPk(dto.id_object);
                if (!route) {
                    throw new BadRequestException("Выбранной точки не существует");
                }
                break;
            default: 
                throw new BadRequestException("Выбранные тип объекта не поддерживается");
        }
        const liked = await this.likedRepository.create({...dto, id_owner});
        return liked;
    }
}
