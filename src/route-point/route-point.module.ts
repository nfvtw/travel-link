import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoutePoint } from './route-point.model';

@Module({
    imports: [
        SequelizeModule.forFeature([RoutePoint]),
    ]
})
export class RoutePointModule {}
