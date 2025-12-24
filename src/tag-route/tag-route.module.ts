import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagRoute } from './tag-route.model';

@Module({
    imports: [
        SequelizeModule.forFeature([TagRoute]),
    ]
})
export class TagRouteModule {}
