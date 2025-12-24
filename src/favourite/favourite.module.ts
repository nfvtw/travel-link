import { Module } from '@nestjs/common';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favourite } from './favourite.model';

@Module({
  controllers: [FavouriteController],
  providers: [FavouriteService],
  imports: [
    SequelizeModule.forFeature([Favourite]),
  ]
})
export class FavouriteModule {}
