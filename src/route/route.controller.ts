import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RouteService } from './route.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createRouteDto } from './dto/create-route.dto';

@Controller('route')
export class RouteController {

    constructor(private routeService: RouteService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createRoute(@Req() req: any, @Body() routeDto: createRouteDto) {
        const id_owner = req?.user.id;
        return this.routeService.create(routeDto, id_owner)
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

}
