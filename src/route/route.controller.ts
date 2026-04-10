import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RouteService } from './route.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createRouteDto } from './dto/create-route.dto';
import { PointOfInterestDto } from './dto/get-point-of-interest.dto';
import { UpgradeRouteDto } from './dto/upgrade-route.dto';
import { UpgradeRoutePointsDto } from './dto/upgrade-points.dto';

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

    @Get('cards/:id')
    getRouteCardsInformation(@Param('id') id: number) {
        return this.routeService.getCardsInfo(id)
    }

    @Post('pof')
    getPointOfInterestWithRadius(@Body() pointOfInterestDto: PointOfInterestDto) {
        return this.routeService.getPointOfInterest(pointOfInterestDto);
    }


}
