import { Injectable } from '@nestjs/common';
import { CreatePointDTO } from './dto/create-point.dto';
import { Point } from './point.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PointService {

    constructor(@InjectModel(Point) private pointRepository: typeof Point) {}

    async create(dto: CreatePointDTO) {
        const point  = this.pointRepository.create(dto);
        return point;
    }
}
