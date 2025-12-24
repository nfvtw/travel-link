import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './review.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    SequelizeModule.forFeature([Review]),
  ]
})
export class ReviewModule {}
