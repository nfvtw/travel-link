import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateFavouriteDto } from './dto/create-favourite.dto';

@Controller('favourite')
export class FavouriteController {

    constructor(private favouriteService: FavouriteService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createOrDelete(@Req() req: any, @Body() favouriteDto: CreateFavouriteDto) {
        const id_owner = req?.user.id;
        return this.favouriteService.createOrDeleteFavourite(favouriteDto, id_owner);
    }
}
