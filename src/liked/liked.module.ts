import { Module } from '@nestjs/common';
import { LikedController } from './liked.controller';
import { LikedService } from './liked.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Liked } from './liked.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Point } from 'src/point/point.model';
import { Route } from 'src/route/route.model';

@Module({
  controllers: [LikedController],
  providers: [LikedService],
  imports: [
    SequelizeModule.forFeature([Liked, Point, Route]),
    JwtModule,
    AuthModule,
  ]
})
export class LikedModule {}
