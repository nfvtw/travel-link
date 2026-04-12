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
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { PointOfInterestDto } from './dto/get-point-of-interest.dto';
import { UpgradeRouteDto } from './dto/upgrade-route.dto';
import { UpgradeRoutePointsDto } from './dto/upgrade-points.dto';
import { Liked } from 'src/liked/liked.model';
import { Review } from 'src/review/review.model';

@Injectable()
export class RouteService {

    constructor(@InjectModel(Route) private routeRepository: typeof Route, 
                @InjectModel(RoutePoint) private routePointRepository: typeof RoutePoint,
                @InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(TagRoute) private tagRouteRepository: typeof TagRoute,
                @InjectModel(Liked) private likedRepository: typeof Liked,
                @InjectModel(Review) private reviewRepository: typeof Review,
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

    async getCardsInfo (id_page: number, id_owner: number) {
        try {

            const offset = id_page * 10;
            let routes = await this.routeRepository.findAll({
                limit: 10,
                offset: offset,
                include: [{
                    model: TagRoute,
                    attributes: [ 'id_tag' ],
                    include: [{
                        model: Tag,
                        attributes: [ 'name' ]
                    }]
                },
                {
                    model: User,
                    attributes: [ ["username", "author"], ["photo", "authorPfp"] ]
                },
                {
                    model: RoutePoint,
                    attributes: ["id_point"],
                    include: [{
                        model: Point,
                        attributes: [ ["name", "pointName"], ["type", "pointType"], ["address", "pointLocation"], ["description", "pointDescription"], ["photos", "image"], ["rating", "pointRating"]]
                    }]
                }],
                attributes: [ 'id', [ 'name', 'routeName' ], [ 'description', 'routeDescription' ], ['count_likes', "likeCount"], ["createdAt", "creationDate"], ['first_photo', 'image'] ],
            })

            console.log(routes[0].dataValues.routes_points.map(t => t.dataValues.points))

            const routeIds = routes.map(r => r.id);

            const allPointIds = new Set<number>();
            routes.forEach(route => {
                const data = route.get({ plain: true }) as any;
                const routePoints = data.routes_points || []; 
                
                routePoints.forEach((rp: any) => {
                    if (rp.points?.id) {  
                        allPointIds.add(rp.points.id);
                    }
                });
            });

            // 3. Если есть маршруты — проверяем лайки текущего пользователя
            let likedRouteIds: Set<number> = new Set();
            if (routeIds.length > 0) {
                const liked = await this.likedRepository.findAll({
                    attributes: ['id_object'],
                    where: {
                        id_owner: id_owner,
                        type_object: 'route',
                        id_object: { [Op.in]: routeIds }
                    }
                });
                likedRouteIds = new Set(liked.map(l => l.id_object));
            }

            let reviewCounts: Map<number, number> = new Map();
            if (routeIds.length > 0) {
                const reviews = await this.reviewRepository.findAll({
                    attributes: [
                        'id_object',
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'] // COUNT(id)
                    ],
                    where: {
                        type_object: 'route', 
                        id_object: { [Op.in]: routeIds }
                    },
                    group: ['id_object'], 
                    raw: true  
                });
                
                reviewCounts = new Map(
                    reviews.map((r: any) => [r.id_object, parseInt(r.count) || 0])
                );
            }

            let pointReviewCounts: Map<number, number> = new Map();
            if (allPointIds.size > 0) {
                const pointReviews = await this.reviewRepository.findAll({
                    attributes: [
                        'id_object',
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                    ],
                    where: {
                        type_object: 'point', 
                        id_object: { [Op.in]: Array.from(allPointIds) }
                    },
                    group: ['id_object'],
                    raw: true
                });
                pointReviewCounts = new Map(
                    pointReviews.map((r: any) => [r.id_object, parseInt(r.count) || 0])
                );
            }



            return routes.map(route => {
            const data = route.get({ plain: true }) as any;
            
            // 👇 Обрабатываем точки с правильными именами свойств
            const points = (data.routes_points || []).map((rp: any) => {
                const point = rp.points; 
                if (!point) return null;
                
                return {
                    pointName: point.pointName,
                    pointType: point.pointType,
                    pointLocation: point.pointLocation,
                    pointDescription: point.pointDescription,
                    image: /*point.image*/ "/search-window/alpaca.jpg",
                    rating: point.rating,
                    ratingCount: pointReviewCounts.get(point.id) || 0,
                };
            }).filter((p: any) => p !== null);

            

            return {
                id: data.id,
                routeName: data.routeName,
                routeDescription: data.routeDescription,
                likeCount: data.likeCount,
                creationDate: data.creationDate,
                author: data.owner.author,
                authorPfp: data.owner.authorPfp,
                routeTags: data.TagRoutes?.map((tr: any) => tr.Tag?.name) || [],
                isLiked: likedRouteIds.has(data.id),
                commentCount: reviewCounts.get(data.id) || 0,
                points: points,
                image: /*data.image*/ "/search-window/checker.jpg"
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
