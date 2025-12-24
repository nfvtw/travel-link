import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Point } from './point.model';

@Module({
  providers: [PointService],
  controllers: [PointController],
  imports: [
    SequelizeModule.forFeature([Point]),
  ],
  exports: [
    PointService,
  ]
})
export class PointModule {}
