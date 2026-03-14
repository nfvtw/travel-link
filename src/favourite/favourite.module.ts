import { Module } from '@nestjs/common';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favourite } from './favourite.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FavouriteController],
  providers: [FavouriteService],
  imports: [
    SequelizeModule.forFeature([Favourite]),
    JwtModule,
    AuthModule,
  ]
})
export class FavouriteModule {}
