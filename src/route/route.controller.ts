import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RouteService } from './route.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createRouteDto } from './dto/create-route.dto';
import { PointOfInterestDto } from './dto/get-point-of-interest.dto';
import { UpgradeRouteDto } from './dto/upgrade-route.dto';
import { UpgradeRoutePointsDto } from './dto/upgrade-points.dto';
import { JwtAuthExceptionGuard } from 'src/auth/guards/jwt-auth-exception.guard';

@Controller('route')
export class RouteController {

    constructor(private routeService: RouteService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createRoute(@Req() req: any, @Body() routeDto: createRouteDto) {
        const id_owner = req?.user.id;
        return this.routeService.create(routeDto, id_owner)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/upgrade')
    upgradeRoute(@Body() upgradeDto: UpgradeRouteDto) {
        return this.routeService.upgrade(upgradeDto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/upgrade_points')
    upgradeRoutePoints(@Body() upgradedPointsDto: UpgradeRoutePointsDto) {
        return this.routeService.upgradePoints(upgradedPointsDto);
    }

    @Get('/:id/laid')
    getLaidRoute(@Param('id') id: number) {
        return this.routeService.getDirections(id)
    }

    @Get('/card/:id')
    getRouteCardInformation(@Param('id') id: number) {
        return this.routeService.getCardInfo(id)
    }

    @Get('/:id')
    getRouteInformation(@Param('id') id: number) {
        return this.routeService.getRouteInfo(id)
    }

    @UseGuards(JwtAuthExceptionGuard)
    @Get('cards/:id')
    getRouteCardsInformation(@Req() req: any, @Param('id') id: number) {
        const id_owner = req?.user.id ?? null;
        return this.routeService.getCardsInfo(id, id_owner)
    }

    @Post('pof')
    getPointOfInterestWithRadius(@Body() pointOfInterestDto: PointOfInterestDto) {
        return this.routeService.getPointOfInterest(pointOfInterestDto);
    }


}
