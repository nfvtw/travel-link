import { Module } from '@nestjs/common';
import { Tag } from './tag.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Tag])
    ],
    controllers: [TagController],
    providers: [TagService]
})
export class TagModule {}
