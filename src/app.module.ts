import { Module } from "@nestjs/common";
import { UserModule } from './user/user.module';
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { User } from "./user/user.model";
import { AuthModule } from './auth/auth.module';
import { PointController } from './point/point.controller';
import { PointModule } from './point/point.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User],
      autoLoadModels: true,
      synchronize: true, 
      sync: {},
    }),
    UserModule,
    AuthModule,
    PointModule
  ],
  controllers: [PointController]
})
export class AppModule {

}