import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePointDTO } from './dto/create-point.dto';
import { PointService } from './point.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('point')
export class PointController {

    constructor(private pointService: PointService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createPoint(@Req() req: any, @Body() pointDto: CreatePointDTO) {
        const id_owner = req?.user.id;
        return this.pointService.create(pointDto, id_owner);
    }

    @Get('/card/:id')
    getPointCardInformation(@Param('id') id: number) {
            return this.pointService.getCardInfo(id)
        }

}
