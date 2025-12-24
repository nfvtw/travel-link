import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Route } from './route.model';

@Module({
  controllers: [RouteController],
  providers: [RouteService],
  imports: [
    SequelizeModule.forFeature([Route]),
  ]
})
export class RouteModule {}
