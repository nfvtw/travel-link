import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PointService } from './point.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePointDTO } from './dto/create-point.dto';
import { CreatePointByAddressDTO } from './dto/create-point-by-address.dto';
import { CreatePointByCoordinatesDTO } from './dto/create-point-by-coordinates.dto';
import { UpdatePointDTO } from './dto/upgrade-point.dto';
import { GetPolyPointsDTO } from './dto/get-poly-points.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';


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
    @UseInterceptors(FilesInterceptor('photos', 10, { // 'photos' - ключ для файлов, 10 - макс. кол-во фото
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'), 
      filename: (req, file, cb) => {
        const uniqueName = uuidv4() + extname(file.originalname);
        cb(null, uniqueName);
      }
    })
  }))
    createPointByAddress(@Req() req: any, @Body() pointDto: CreatePointByAddressDTO, @UploadedFiles() files: Array<Express.Multer.File>,) {
        const id_owner = req?.user.id;
        const photoUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];

        const pointData = {
        ...pointDto,
        photos: photoUrls, // Перезаписываем/добавляем поле photos
        };

        return this.pointService.CreateByAddress(pointData, id_owner);
    }

    @Post('/getPolyPoint')
    getPolygonPoints(@Body() polyDto: GetPolyPointsDTO) {
        return this.pointService.getPolyPoints(polyDto)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update/:id_point')
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
