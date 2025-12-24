import { Module } from '@nestjs/common';
import { LikedController } from './liked.controller';
import { LikedService } from './liked.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Liked } from './liked.model';

@Module({
  controllers: [LikedController],
  providers: [LikedService],
  imports: [
    SequelizeModule.forFeature([Liked])
  ]
})
export class LikedModule {}
