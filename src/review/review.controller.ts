import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateReviewForPointDto } from './dto/create-review-for-point.dto';
import { ReviewService } from './review.service';
import { CreateReviewForRouteDto } from './dto/create-review-for-route.dto';

@Controller('review')
export class ReviewController {

    constructor(private reviewService: ReviewService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create/point')
    createForPoint(@Req() req: any, @Body() reviewDto: CreateReviewForPointDto) {
        const id_owner = req?.user.id;
        const review = this.reviewService.createReviewForPoint(reviewDto, id_owner)
        return review;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create/route')
    createForRoute(@Req() req: any, @Body() reviewDto: CreateReviewForRouteDto) {
        const id_owner = req?.user.id;
        const review = this.reviewService.createReviewForRoute(reviewDto, id_owner)
        return review;
    }

    @Get('/get/:type_object/:id_object')
    getReviewsById(@Param("type_object") type_object: string, @Param("id_object") id_object: number) {
        return this.reviewService.getReviews(type_object, id_object);
    }

    @Get('/count/:type_object/:id_object')
    getReviewsCountById(@Param("type_object") type_object: string, @Param("id_object") id_object: number) {
        return this.reviewService.getReviewsCount(type_object, id_object)
    }
}
