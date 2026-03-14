import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Point } from './point.model';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TagPoint } from 'src/tag-point/tag-point.model';
import { Tag } from 'src/tag/tag.model';

@Module({
  providers: [PointService],
  controllers: [PointController],
  imports: [
    SequelizeModule.forFeature([Point, TagPoint, Tag]),
    AuthModule, 
    JwtModule
  ],
  exports: [
    PointService,
  ]
})
export class PointModule {}
