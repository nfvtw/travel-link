import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Point } from './point.model';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TagPoint } from 'src/tag-point/tag-point.model';
import { Tag } from 'src/tag/tag.model';
import { HttpModule } from '@nestjs/axios';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { Achievements } from 'src/achievements/achievements.model';
import { Review } from 'src/review/review.model';

@Module({
  providers: [PointService],
  controllers: [PointController],
  imports: [
    SequelizeModule.forFeature([Point, TagPoint, Tag, Achievements, Review]),
    AuthModule,
    AchievementsModule, 
    JwtModule,
    HttpModule
  ],
  exports: [
    PointService,
  ]
})
export class PointModule {}
