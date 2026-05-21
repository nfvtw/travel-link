import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { Point } from './point.model';
import { InjectModel } from '@nestjs/sequelize';
import { TagPoint } from 'src/tag-point/tag-point.model';
import { Tag } from 'src/tag/tag.model';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { CreatePointDTO } from './dto/create-point.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreatePointByCoordinatesDTO } from './dto/create-point-by-coordinates.dto';
import { CreatePointByAddressDTO } from './dto/create-point-by-address.dto';
import { UpdatePointDTO } from './dto/upgrade-point.dto';
import { Achievements } from 'src/achievements/achievements.model';
import { AchievementsService } from 'src/achievements/achievements.service';
import { Review } from 'src/review/review.model';
import { GetPolyPointsDTO } from './dto/get-poly-points.dto';

@Injectable()
export class PointService {

    constructor(@InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(TagPoint) private tagPointRepository: typeof TagPoint,
                @InjectModel(Tag) private tagRepository: typeof Tag,
                @InjectModel(Achievements) private achievementsRepository: typeof Achievements,
                @InjectModel(Review) private reviewRepository: typeof Review,
                private readonly httpService: HttpService,
                private readonly achievementsService: AchievementsService) {}

    async CreateByCoordinates(dto: CreatePointByCoordinatesDTO, id_owner: number) {

        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
        const token = process.env.DaData_API_KEY;
        const [lon, lat] = dto.coordinates.coordinates;

        const response = await firstValueFrom(
            this.httpService.post(
                url,
                {
                    lat: lat,
                    lon: lon,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Token ${token}`,
                    },
                }
            )
        );

        const address = response.data?.suggestions[0]?.value;

        const newPoint: CreatePointDTO = {...dto, address};

        const id_tags = await this.tagRepository.findAll({
            where: { name: { [Op.in]: dto?.tags } },
            attributes: ["id"]
        })
        if (id_tags?.length !== dto.tags?.length) {
            throw new BadRequestException(`Ошибка при указании тегов`)
        }
        const first_photo = newPoint.photos[0];
        const point = await this.pointRepository.create({...newPoint, id_owner, first_photo})

        await this.achievementsRepository.increment('added_places', {
            by: 1,
            where: { id_owner },
        });

        await this.achievementsService.checkLevelUp(id_owner);

        const tagData = id_tags.map(tag => ({
            id_tag: tag.id,
            id_point: point.id
        }))
        const pointTags = await this.tagPointRepository.bulkCreate(tagData)
        return {
            message: "Точка успешно создана",
            point,
            pointTags
        };
    }

    async CreateByAddress(dto: CreatePointByAddressDTO, id_owner: number) {
        try {

            const url = "https://cleaner.dadata.ru/api/v1/clean/address";
            const token = process.env.DaData_API_KEY;
            const secret = process.env.DaData_SECRET_KEY;
            const query = dto.address;
            
            const response = await firstValueFrom(
            this.httpService.post(
                url,
                [query],
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`,
                        "X-Secret": secret,
                    },
                })
            );

            console.log(response.data)

            if (response.data[0]?.unparsed_parts) {
                return {
                    message: "Точка не создана, введите корректный адрес"
                }
            }

            const [lon, lat] = [parseFloat(response.data[0]?.geo_lon), parseFloat(response.data[0]?.geo_lat)];
            const coordinates = { type: 'Point', coordinates: [lon, lat] as [number, number] }
            const newAddress = response.data[0]?.result;


            const newPoint: CreatePointDTO = {...dto, coordinates, address: newAddress};

            const id_tags = await this.tagRepository.findAll({
                where: { name: { [Op.in]: dto?.tags } },
                attributes: ["id"]
            })
            if (id_tags?.length !== dto.tags?.length) {
                throw new BadRequestException(`Ошибка при указании тегов`)
            }
            const first_photo = newPoint.photos[0];
            const point = await this.pointRepository.create({...newPoint, id_owner, first_photo})

            await this.achievementsRepository.increment('added_places', {
                by: 1,
                where: { id_owner },
            });

            await this.achievementsService.checkLevelUp(id_owner);

            const tagData = id_tags.map(tag => ({
                id_tag: tag.id,
                id_point: point.id
            }))
            const pointTags = await this.tagPointRepository.bulkCreate(tagData)
            return {
                point,
                pointTags
            };
        } catch (error) {
            console.log(error)
        }
    }

    async upgradePoint(id_point: number, id_owner: number, dto: UpdatePointDTO) {
    try {
        const point = await this.pointRepository.findByPk(id_point);

        if (!point) {
            throw new BadRequestException('Точка не найдена');
        }

        if (point.dataValues.id_owner !== id_owner) {
            throw new ForbiddenException('Нет доступа: Вы не владелец этой точки');
        }

        let updatedAddress = point.dataValues.address;

        if (dto.coordinates) {
            const [lon, lat] = dto.coordinates.coordinates;

            const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
            const token = process.env.DaData_API_KEY;

            const response = await firstValueFrom(
                this.httpService.post(
                    url,
                    { lat, lon },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Token ${token}`,
                        },
                    }
                )
            );

            const address = response.data?.suggestions?.[0]?.value;

            if (!address) {
                throw new BadRequestException('Не удалось определить адрес');
            }

            updatedAddress = address;
        }

        const updatedFields: any = {};

        if (dto.name !== undefined) updatedFields.name = dto.name;
        if (dto.description !== undefined) updatedFields.description = dto.description;
        if (dto.is_free !== undefined) updatedFields.is_free = dto.is_free;
        if (dto.photos !== undefined) updatedFields.photos = dto.photos;
        if (dto.coordinates !== undefined) updatedFields.coordinates = dto.coordinates;
        if (dto.first_photo !== undefined) updatedFields.first_photo = dto.first_photo

        if (dto.coordinates) {
            updatedFields.address = updatedAddress;
        }

        await point.update(updatedFields);

        return {
            message: "Точка успешно обновлена",
            point
        };

    } catch (error) {
        console.log(error);
        throw error;
    }
}

    async deletePoint (id_point: number, id_owner: number) {
        try {

            const point = await this.pointRepository.findByPk(id_point);
            if (!point) {
                throw new BadRequestException('Такой точки не существует')
            }

            if (point.dataValues.id_owner != id_owner) {
                throw new BadRequestException('Вы не являетесь владельцем этой точки')
            }

            await this.pointRepository.destroy({
                where: { id: id_point }
            })

            return {
                message: `Точка ${point.dataValues.name} успешно была удалена`
            }

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async getPoint(id: number) {
    try {
        // 1. Находим саму точку
        const point = await this.pointRepository.findByPk(id);
        
        if (!point) {
            return {
                message: "Точки не существует"
            };
        }

        // 2. Считаем количество отзывов для этой точки
        // Обрати внимание на 'point' — используй то значение, 
        // которым ты помечаешь точки в колонке type_object
        const ratingCount = await this.reviewRepository.count({
            where: {
                type_object: 'point', 
                id_object: id
            }
        });

        console.log(point.dataValues)

        // 3. Маппим данные под интерфейс фронтенда (PointData)
        const pointData = {
            id: point.dataValues.id,
            pointName: point.dataValues.name,
            pointType: point.dataValues.type,
            pointLocation: point.dataValues.address,
            pointDescription: point.dataValues.description,
            image: point.dataValues.first_photo || "",
            // Колонка rating имеет тип numeric, из-за чего Sequelize 
            // возвращает строку ("0.0"). Явно приводим к числу.
            pointRating: Number(point.dataValues.rating), 
            ratingCount: ratingCount,
            // Если photos в БД это json-массив, просто передаем его,
            // если он пустой (null), то отдаем пустой массив
            imageCarousel: point.dataValues.photos ? point.dataValues.photos : [] 
        };

        return pointData;
        
    } catch (error) {
        console.log(error);
        throw error; // Бросаем ошибку дальше, чтобы перехватить в контроллере
    }
}

    async getCardInfo(id_point: number) {
        try {

            let point = await this.pointRepository.findByPk(id_point, {
                attributes: [ ['name', 'pointName'], ['description', 'pointDescription'], ['coordinates', 'pointLocation'], 'rating', 'photos', 'address' ]
            });
            if (!point) {
                throw new BadRequestException('Выбранной точки не существует')
            };
            if (point.dataValues.photos) {
                point.dataValues.photos = [point.dataValues.photos[0]];
            }
            console.log(point?.dataValues)
            return (point);
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    
    async getCardsInfo(id_page: number) {
    try {
        const limit = 10;
        const offset = id_page * limit;

        const points = await this.pointRepository.findAll({
            limit,
            offset,
            include: [{
                model: TagPoint,
                include: [{
                    model: Tag,
                    attributes: ['name']
                }],
                attributes: ['id_tag']
            }],
            attributes: [
                'id',
                ['name', 'pointName'],
                ['description', 'pointDescription'],
                ['address', 'pointLocation'],
                ['coordinates', 'coord'],
                ['type', 'pointType'],
                'category',
                'rating',
                'photos',
                'first_photo'
            ],
            order: [['id', 'ASC']]
        });

        console.log(points.map(p => p.dataValues))

        

        return await Promise.all(points.map( async (p) => {
            const data = p.get({ plain: true }) as any;

            console.log(data)

            const ratingCount = await this.reviewRepository.count({
                    where: {
                        type_object: 'point', 
                        id_object: data.id
                    }
                });

            return {
                id: data.id,
                pointName: data.pointName,
                pointType: data.pointType,
                pointLocation: data.pointLocation,
                pointDescription: data.pointDescription,
                image: data.first_photo,
                pointRating: Number(data.rating),
                ratingCount: ratingCount,
                imageCarousel: data.photos
            };
        }));

    } catch (error) {
        console.log(error);
        throw error; 
    }
}

    async getPolyPoints (dto: GetPolyPointsDTO) {
        try {

            const points = await this.pointRepository.sequelize?.query(`
                    SELECT *
                    FROM point
                    WHERE ST_Within(
                        coordinates,
                        ST_MakeEnvelope(:sw_lng, :sw_lat, :ne_lng, :ne_lat, 4326)
                    );
                    `, 
                    {
                        replacements: { 
                            sw_lng: dto.southWest.lng,
                            sw_lat: dto.southWest.lat,
                            ne_lng: dto.northEast.lng,
                            ne_lat: dto.northEast.lat
                        },
                        type: QueryTypes.SELECT
                    }
            );

            const formattedPoints = points?.map((p: any) => ({
                id: p.id,
                category: p.category,
                lng: p.coordinates.coordinates[0], 
                lat: p.coordinates.coordinates[1]  
            }));
            
            return formattedPoints;

        } catch (error) {
            console.log(error)
        }
    }
}
