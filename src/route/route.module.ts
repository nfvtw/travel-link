import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Route } from './route.model';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RoutePoint } from 'src/route-point/route-point.model';
import { Point } from 'src/point/point.model';
import { HttpModule } from '@nestjs/axios';
import { TagRoute } from 'src/tag-route/tag-route.model';
import { Tag } from 'src/tag/tag.model';
import { User } from 'src/user/user.model';

@Module({
  controllers: [RouteController],
  providers: [RouteService],
  imports: [
    SequelizeModule.forFeature([Route, RoutePoint, Point, TagRoute, Tag, User]),
    AuthModule,
    JwtModule,
    HttpModule
  ]
})
export class RouteModule {}
