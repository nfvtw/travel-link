import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './review.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Point } from 'src/point/point.model';
import { Route } from 'src/route/route.model';
import { User } from 'src/user/user.model';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    SequelizeModule.forFeature([Review, Point, Route, User]),
    JwtModule,
    AuthModule,
  ]
})
export class ReviewModule {}
