import { Body, Controller, Post } from '@nestjs/common';
import { CreatePointDTO } from './dto/create-point.dto';
import { PointService } from './point.service';

@Controller('point')
export class PointController {

    constructor(private pointService: PointService) {}
    
    @Post('/create')
    createPoint(@Body() pointDto: CreatePointDTO) {
        return this.pointService.create(pointDto);
    }

}
