import { Module } from '@nestjs/common';
import { LikedController } from './liked.controller';
import { LikedService } from './liked.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Liked } from './liked.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Point } from 'src/point/point.model';
import { Route } from 'src/route/route.model';
import { Achievements } from 'src/achievements/achievements.model';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { User } from 'src/user/user.model';

@Module({
  controllers: [LikedController],
  providers: [LikedService],
  imports: [
    SequelizeModule.forFeature([Liked, Point, Route, Achievements, User]),
    AchievementsModule,
    JwtModule,
    AuthModule,
  ]
})
export class LikedModule {}
