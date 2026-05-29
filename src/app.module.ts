import { Module } from "@nestjs/common";
import { UserModule } from './user/user.module';
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { User } from "./user/user.model";
import { AuthModule } from './auth/auth.module';
import { PointController } from './point/point.controller';
import { PointModule } from './point/point.module';
import { RouteModule } from './route/route.module';
import { ReviewModule } from './review/review.module';
import { FavouriteModule } from './favourite/favourite.module';
import { LikedModule } from './liked/liked.module';
import { TagModule } from './tag/tag.module';
import { Point } from "./point/point.model";
import { Review } from "./review/review.model";
import { Route } from "./route/route.model";
import { Favourite } from "./favourite/favourite.model";
import { Liked } from "./liked/liked.model";
import { Tag } from "./tag/tag.model";
import { RoutePointModule } from './route-point/route-point.module';
import { RoutePoint } from "./route-point/route-point.model";
import { TagPointModule } from './tag-point/tag-point.module';
import { TagRouteModule } from './tag-route/tag-route.module';
import { TagPoint } from "./tag-point/tag-point.model";
import { TagRoute } from "./tag-route/tag-route.model";
import { SearchModule } from './search & filter/search.module';
import { AchievementsModule } from './achievements/achievements.module';
import { Achievements } from "./achievements/achievements.model";
import { FilesController } from "./files/files.controller";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), 
      serveRoot: '/uploads',                      
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Point, Review, Route, Favourite, Liked, Tag, RoutePoint, TagPoint, TagRoute, Achievements],
      autoLoadModels: true,
      synchronize: true, 
      sync: {  },
    }),
    UserModule,
    AuthModule,
    PointModule,
    RouteModule,
    ReviewModule,
    FavouriteModule,
    LikedModule,
    TagModule,
    RoutePointModule,
    TagPointModule,
    TagRouteModule,
    SearchModule,
    AchievementsModule,
    FilesModule
  ],
  
  controllers: [],
  providers: []
})
export class AppModule {

}