import { Module } from '@nestjs/common';
import { Tag } from './tag.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forFeature([Tag])
    ]
})
export class TagModule {}
