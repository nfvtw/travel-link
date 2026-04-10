import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { Point } from './point.model';
import { InjectModel } from '@nestjs/sequelize';
import { TagPoint } from 'src/tag-point/tag-point.model';
import { Tag } from 'src/tag/tag.model';
import { Op } from 'sequelize';
import { CreatePointDTO } from './dto/create-point.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreatePointByCoordinatesDTO } from './dto/create-point-by-coordinates.dto';
import { CreatePointByAddressDTO } from './dto/create-point-by-address.dto';
import { UpdatePointDTO } from './dto/upgrade-point.dto';

@Injectable()
export class PointService {

    constructor(@InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(TagPoint) private tagPointRepository: typeof TagPoint,
                @InjectModel(Tag) private tagRepository: typeof Tag,
                private readonly httpService: HttpService) {}

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
        const point = await this.pointRepository.create({...newPoint, id_owner})
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
            const point = await this.pointRepository.create({...newPoint, id_owner})
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

            const point = await this.pointRepository.findByPk(id);
            if (!point) {
                return {
                    message: "Точки не существует"
                }
            }
            return (point);
            
        } catch (error) {
            console.log(error)
            throw error;
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
                ['coordinates', 'pointLocation'],
                'rating',
                'photos'
            ],
            order: [['id', 'ASC']]
        });

        return points.map(p => {
            const data = p.get({ plain: true }) as any;

            return {
                pointResponse: {
                    id: data.id,
                    pointName: data.pointName,
                    pointDescription: data.pointDescription,
                    pointLocation: data.pointLocation,
                    rating: data.rating,
                    photos: data.photos?.length ? [data.photos[0]] : []
                },
                pointTagsResponse: data.tags_points?.map((t: any) => t.tags.name) || []
            };
        });

    } catch (error) {
        console.log(error);
        throw error; 
    }
}
}
