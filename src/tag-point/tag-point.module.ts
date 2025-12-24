import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagPoint } from './tag-point.model';

@Module({
    imports: [
        SequelizeModule.forFeature([TagPoint]),
    ]
})
export class TagPointModule {}
