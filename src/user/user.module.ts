import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { AuthModule } from 'src/auth/auth.module';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { Achievements } from 'src/achievements/achievements.model';
import { Route } from 'src/route/route.model';
import { Point } from 'src/point/point.model';
import { Review } from 'src/review/review.model';
import { Liked } from 'src/liked/liked.model';
import { RoutePoint } from 'src/route-point/route-point.model';


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Achievements, Point, Route, Review, Liked, RoutePoint]),
    forwardRef(() => AuthModule),
    AchievementsModule
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
