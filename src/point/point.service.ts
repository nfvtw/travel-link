import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePointDTO } from './dto/create-point.dto';
import { Point } from './point.model';
import { InjectModel } from '@nestjs/sequelize';
import { TagPoint } from 'src/tag-point/tag-point.model';
import { Tag } from 'src/tag/tag.model';
import { Op } from 'sequelize';

@Injectable()
export class PointService {

    constructor(@InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(TagPoint) private tagPointRepository: typeof TagPoint,
                @InjectModel(Tag) private tagRepository: typeof Tag) {}

    async create(dto: CreatePointDTO, id_owner: number) {
        const id_tags = await this.tagRepository.findAll({
            where: { name: { [Op.in]: dto?.tags } },
            attributes: ["id"]
        })
        if (id_tags?.length !== dto.tags?.length) {
            throw new BadRequestException(`Ошибка при указании тегов`)
        }
        const point = await this.pointRepository.create({ ...dto, id_owner})
        const tagData = id_tags.map(tag => ({
            id_tag: tag.id,
            id_point: point.id
        }))
        const pointTags = await this.tagPointRepository.bulkCreate(tagData)
        return {
            point,
            pointTags
        };
    }

    async getCardInfo(id_point: number) {
        try {

            let point = await this.pointRepository.findByPk(id_point, {
                attributes: [ ['name', 'pointName'], ['description', 'pointDescription'], ['coordinates', 'pointLocation'], 'rating', 'photos' ]
            });
            if (!point) return null;
            if (point.dataValues.photos) {
                point.dataValues.photos = [point.dataValues.photos[0]];
            }
            console.log(point?.dataValues)
            return (point);
        } catch (error) {
            console.log(error)
        }
    }
}
