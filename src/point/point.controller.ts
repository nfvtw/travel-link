import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PointService } from './point.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePointDTO } from './dto/create-point.dto';
import { CreatePointByAddressDTO } from './dto/create-point-by-address.dto';
import { CreatePointByCoordinatesDTO } from './dto/create-point-by-coordinates.dto';
import { UpdatePointDTO } from './dto/upgrade-point.dto';
import { get } from 'axios';
import { GetPolyPointsDTO } from './dto/get-poly-points.dto';


@Controller('point')
export class PointController {

    constructor(private pointService: PointService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('/create/c')
    createPointByCoordinates(@Req() req: any, @Body() pointDto: CreatePointByCoordinatesDTO) {
        const id_owner = req?.user.id;
        return this.pointService.CreateByCoordinates(pointDto, id_owner);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create/a')
    createPointByAddress(@Req() req: any, @Body() pointDto: CreatePointByAddressDTO) {
        const id_owner = req?.user.id;
        return this.pointService.CreateByAddress(pointDto, id_owner);
    }

    @Get('/getPolyPoint')
    getPolygonPoints(@Body() polyDto: GetPolyPointsDTO) {
        return this.pointService.getPolyPoints(polyDto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update/:id_point')
    upgradePoint(@Req() req: any, @Param('id_point') id_point: number, @Body() updateDto: UpdatePointDTO) {
        const id_owner = req?.user.id;
        return this.pointService.upgradePoint(id_point, id_owner, updateDto)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id_point')
    deletePoint(@Req() req: any, @Param('id_point') id_point: number) {
        const id_owner = req?.user.id;
        return this.pointService.deletePoint(id_point, id_owner)
    }

    @Get('/:id')
    getPointInformation(@Param('id') id: number) {
        return this.pointService.getPoint(id)
    }

    @Get('/card/:id')
    getPointCardInformation(@Param('id') id: number) {
        return this.pointService.getCardInfo(id)
    }

    @Get('/cards/:id')
    getPointCardsInformation(@Param('id') id_page: number) {
        return this.pointService.getCardsInfo(id_page)
    }


}
