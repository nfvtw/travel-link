import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Route } from './route.model';
import { createRouteDto } from './dto/create-route.dto';
import { RoutePoint } from 'src/route-point/route-point.model';
import { Point } from 'src/point/point.model';
import { HttpService } from '@nestjs/axios';
import { first, firstValueFrom } from 'rxjs';
import { TagRoute } from 'src/tag-route/tag-route.model';
import { Tag } from 'src/tag/tag.model';
import { User } from 'src/user/user.model';
import { Op, QueryTypes } from 'sequelize';
import { PointOfInterestDto } from './dto/get-point-of-interest.dto';
import { UpgradeRouteDto } from './dto/upgrade-route.dto';
import { UpgradeRoutePointsDto } from './dto/upgrade-points.dto';

@Injectable()
export class RouteService {

    constructor(@InjectModel(Route) private routeRepository: typeof Route, 
                @InjectModel(RoutePoint) private routePointRepository: typeof RoutePoint,
                @InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(TagRoute) private tagRouteRepository: typeof TagRoute,
                private readonly httpService: HttpService) {}
    
    

    async create(dto: createRouteDto, id_owner: number) {
        try {
            let first_photo;
            if (!dto.first_photo) {
                const firstPointId = dto.id_points[0];
                const point = await this.pointRepository.findByPk(firstPointId, {
                    attributes: ["photos"]
                })
                first_photo = point?.dataValues.photos[0];
            }
            
            const route = await this.routeRepository.create({...dto, id_owner, first_photo})

            const routePointsData = dto.id_points.map(id_point => ({
                id_route: route?.id,
                id_point: id_point
            }));
            
            // bulkCreate принимает массив ОБЪЕКТОВ вида {
            //      id_point: 1,
            //      id_route: 1
            //      id_point: 2,
            //      id_route: 1
            //      id_point: 3,
            //      id_route: 1
            // }
            // validate - проверка на существование точек
            await this.routePointRepository.bulkCreate(routePointsData, {
                validate: true
            })

            return route;
        } catch (error) {
            console.log(error)
        }
    }

    async upgrade(dto: UpgradeRouteDto) {
        try {

            const route = await this.routeRepository.update({
                name: dto.name,
                description: dto.description
            },
            {
                where: { id: dto.id_route }
            });

            return ("Данные успешно обновлены");

        } catch (error) {
            console.log(error)
        }
    }

    async upgradePoints(dto: UpgradeRoutePointsDto) {
        try {
            await this.routePointRepository.destroy({
                where: { id_route: dto.id_route }
            })

            const routePointsData = dto.id_points.map(id_point => ({
                id_route: dto.id_route,
                id_point: id_point
            }));

            const routePoints = await this.routePointRepository.bulkCreate(routePointsData, {
                validate: true
            })
            return routePoints;
        } catch (error) {
            console.log(error);
        }
    }

    async getDirections (id_route: number) {
        try {
            
            const routePointsInRaw = await this.routePointRepository.findAll({
                where: { id_route },
                include: [{
                    model: Point, 
                    attributes: ['coordinates']
                }],
                order: [['id', 'ASC']]
            })
            if (routePointsInRaw.length == 0) {
                throw new BadRequestException('Route has no points');
            }
            const coordinates = routePointsInRaw.map(routePoint => {
                const [lon, lat] = routePoint.dataValues.points.dataValues.coordinates.coordinates;
                return [lon, lat];
            }).join(';');

            const urlWalking = `http://router.project-osrm.org/route/v1/walking/${coordinates}?overview=full&geometries=geojson&steps=true&alternatives=true`;
            const urlDriving = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true&alternatives=true`;
            const urlCycling = `http://router.project-osrm.org/route/v1/cycling/${coordinates}?overview=full&geometries=geojson&steps=true&alternatives=true`;

            const responseWalking = await firstValueFrom(
                this.httpService.get(urlWalking)
            );

            const responseDriving = await firstValueFrom(
                this.httpService.get(urlDriving)
            );

            const responseCycling = await firstValueFrom(
                this.httpService.get(urlCycling)
            );

            console.log(responseWalking.data?.routes[0].geometry)
            //console.log(responseWalking.data.waypoints)
            

            return {
                path: responseWalking.data?.routes[0].geometry,
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    async getCardInfo (id_route: number) {
        try {
            const route = await this.routeRepository.findByPk(id_route, {
                attributes: [ 'id', [ 'name', 'routeName' ], [ 'description', 'routeDescription' ], 'count_likes', 'count_dislikes']
            });
            const routeTags = await this.tagRouteRepository.findAll({
                where: { id_route },
                include: [{
                    model: Tag,
                    attributes: ['name']
                }],
                attributes: [ ['id_tag', 'routeTags'] ]
            })
            const routeResponse = route?.dataValues;
            const routeTagsResponse = routeTags.map(t => t.dataValues.tags.dataValues.name);
            const response = {
                routeResponse,
                routeTagsResponse
            }
            return response;
        } catch(error) {
            console.log(error)
        }
    }

    async getCardsInfo (id_page: number) {
        try {

            const offset = id_page * 10;
            let route = await this.routeRepository.findAll({
                limit: 10,
                offset: offset,
                include: [{
                    model: TagRoute,
                    attributes: [ 'id_tag' ],
                    include: [{
                        model: Tag,
                        attributes: [ 'name' ]
                    }]
                }],
                attributes: [ 'id', [ 'name', 'routeName' ], [ 'description', 'routeDescription' ], 'count_likes', 'count_dislikes'],
            })

            

            return route.map(route => {
            const data = route.get({ plain: true }) as any;
            
            return {
                routeResponse: {
                    id: data.id,
                    routeName: data.routeName,
                    routeDescription: data.routeDescription,
                    count_likes: data.count_likes,
                    count_dislikes: data.count_dislikes
                },
                routeTagsResponse: data.tags_routes.map((t: any) => t.tags.name)
            };
        });
        } catch (error) {
            console.log(error)
        }
    }

    async getRouteInfo (id_route: number) {
        try {

            let route = await this.routeRepository.findByPk(id_route, {
                include: [{
                    model: User,
                    attributes: [ 'username', 'photo' ]
                }, {
                    model: RoutePoint,
                    attributes: [ 'id_point' ],
                    include: [{
                        model: Point,
                        attributes: [ 'coordinates' ]
                    }]
                }, {
                    model: TagRoute,
                    attributes: [ 'id_tag' ],
                    include: [{
                        model: Tag,
                        attributes: [ 'name' ]
                    }]
                }],
                attributes: [ 'name', 'description', 'count_likes', 'count_dislikes', 'createdAt' ]
            })

            if (!route) return null;

            let points = route?.dataValues.routes_points.map(p => p.dataValues.points);
            points = points.map(p => p.dataValues)
            const routeTags = route.dataValues.tags_routes.map(t => t.dataValues.tags.dataValues.name)
    
            return {
                routeName: route.dataValues.name,
                routeDescription: route.dataValues.description,
                likeCount: route.dataValues.count_likes,
                dislikeCount: route.dataValues.count_dislikes,
                creationDate: route.dataValues.createdAt,
                author: route.dataValues.owner.dataValues.username,
                authorPfp: route.dataValues.owner.dataValues.photo,
                points,
                routeTags
            };
        } catch (error) {
            console.log(error)
        }
    }

    async getPointOfInterest(dto: PointOfInterestDto) {
        try {

            const [lonA, latA] = dto.firstPoint.coordinates;
            const [lonB, latB] = dto.secondPoint.coordinates;

            const url = `http://router.project-osrm.org/route/v1/walking/${lonA},${latA};${lonB},${latB}?overview=full&geometries=geojson&steps=true&alternatives=true`;

            const response = await firstValueFrom(
                this.httpService.get(url)
            );
            
            const lineString = {
                type: 'LineString',
                coordinates: response.data.routes[0].geometry.coordinates,
            };

            const places = await this.routeRepository.sequelize?.query(`
                SELECT *
                FROM point
                WHERE ST_DWithin(
                    coordinates::geography,
                    ST_GeomFromGeoJSON(:line)::geography,
                    :radius
                )`,
                {
                    replacements: {
                    line: JSON.stringify(lineString),
                    radius: dto.radius,
                    },
                    type: QueryTypes.SELECT,
                },
            );

            console.log(places)
            return places;
        } catch (error) {
            console.log(error)
        }
    }
}
