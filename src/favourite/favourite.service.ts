import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favourite } from './favourite.model';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Point } from 'src/point/point.model';
import { Route } from 'src/route/route.model';

@Injectable()
export class FavouriteService {

    constructor(@InjectModel(Favourite) private favouriteRepository: typeof Favourite,
                @InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(Route) private routeRepository: typeof Route) {}

    async createOrDeleteFavourite(dto: CreateFavouriteDto, id_owner: number) {
        try {
            const duplicateFavourite = await this.favouriteRepository.findOne({
                where: { id_owner, type_object: dto.type_object, id_object: dto.id_object }
            });
            if (duplicateFavourite) {
                await this.favouriteRepository.destroy({
                    where: { type_object: dto.type_object, 
                             id_owner, 
                             id_object: dto.id_object }
                })
                switch(dto.type_object) {
                    case 'point':
                        return {
                            message: "Точка успешно удалена из избранного"
                        }
                    case 'route':
                        return {
                            message: "Маршрут успешно удален из избранного"
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
                        break;
                    default: 
                        throw new BadRequestException("Выбранные тип объекта не поддерживается");
                }
                const favourite = await this.favouriteRepository.create({...dto, id_owner});
                return favourite;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
