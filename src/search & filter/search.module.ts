import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Point } from 'src/point/point.model';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [
    SequelizeModule.forFeature([Point]),
  ]
})
export class SearchModule {}
