import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { addLikedDto } from './dto/add-liked.dto';
import { LikedService } from './liked.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('liked')
export class LikedController {

    constructor(private likedService: LikedService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    add(@Req() req: any, @Body() likedDto: addLikedDto) {
        const id_owner = req?.user.id;
        return this.likedService.addLiked(likedDto, id_owner);
    }

}
