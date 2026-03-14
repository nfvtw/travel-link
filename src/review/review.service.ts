import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './review.model';
import { CreateReviewForPointDto } from './dto/create-review-for-point.dto';
import { Point } from 'src/point/point.model';
import { Route } from 'src/route/route.model';
import { CreateReviewForRouteDto } from './dto/create-review-for-route.dto';

@Injectable()
export class ReviewService {

    constructor(@InjectModel(Review) private reviewRepository: typeof Review,
                @InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(Route) private routeRepository: typeof Route) {}

    async createReviewForPoint(dto: CreateReviewForPointDto, id_owner: number) {

        const point = await this.pointRepository.findByPk(dto.id_object, {
            attributes: ['id', 'rating', 'id_owner']
        });
        if (!point) {
            throw new BadRequestException(`Точки с ID ${dto.id_object} не существует`)
        }

        if (id_owner === point.dataValues.id_owner) {
            throw new BadRequestException(`Нельзя оставлять отзывы для своей точки`)
        }

        if (dto.rating < 0 || dto.rating > 5) {
            throw new BadRequestException(`Рейтинг введен не верно`)
        }

        // Изменение оценки

        const reviews = await this.reviewRepository.findAll({
            where: { id_object: dto.id_object }
        });

        const currentPointRating = point.dataValues.rating;
        const countReviews = reviews.length;
        console.log('(', currentPointRating, '*', countReviews, '+', dto.rating, ')', " / ", countReviews, '+', 1)
        const newRating = (currentPointRating * countReviews + dto.rating) / (countReviews + 1);

        const review = await this.reviewRepository.create({...dto, id_owner});
        await point?.update({
            rating: newRating
        })
        return review;
    }

    async createReviewForRoute(dto: CreateReviewForRouteDto, id_owner: number) {

        const route = await this.routeRepository.findByPk(dto.id_object, {
            attributes: ['id', 'id_owner']
        });
        if (!route) {
            throw new BadRequestException(`Точки с ID ${dto.id_object} не существует`)
        }

        if (!dto.comment) {
            throw new BadRequestException(`Для создания комментария для маршрута нужно указать описание`);
        }

        if (id_owner === route.dataValues.id_owner) {
            throw new BadRequestException(`Нельзя оставлять отзывы для своего маршрута`)
        }

        const review = await this.reviewRepository.create({...dto, id_owner});
        return review;
    }

}
