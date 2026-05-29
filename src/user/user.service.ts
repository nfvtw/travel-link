import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { Achievements } from 'src/achievements/achievements.model';
import { Route } from 'src/route/route.model';
import { Point } from 'src/point/point.model';
import { Review } from 'src/review/review.model';
import { Liked } from 'src/liked/liked.model';
import { RoutePoint } from 'src/route-point/route-point.model';
import { TagRoute } from 'src/tag-route/tag-route.model';
import { Tag } from 'src/tag/tag.model';
import { Op } from 'sequelize';

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Achievements) private achievementsRepository: typeof Achievements,
                @InjectModel(Route) private routeRepository: typeof Route,
                @InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(Review) private reviewRepository: typeof Review,
                @InjectModel(Liked) private likedRepository: typeof Liked,
                @InjectModel(RoutePoint) private routePointRepository: typeof RoutePoint,
                @InjectModel(TagRoute) private routeTagsRepository: typeof TagRoute,
                @InjectModel(Tag) private tagRepository: typeof Tag) {}

    async createUser(dto: CreateUserDTO) {
        const user = await this.userRepository.create(dto);
        console.log(user.dataValues)
        const achievement = await this.achievementsRepository.create({ id_owner: user.dataValues.id })
        return user;
    }

    
    async getAllUsers() {
        const users = await this.userRepository.findAll();
        return users;
    }

    async changeRole() {
        
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email }
        });
        return user;
    }

    async getInfoForUser(id_user: number, id_owner: number) {
        try {

            const user = await this.userRepository.findByPk(id_user);

            if (!user) {
                throw new BadRequestException('No such user')
            }

            const points = await this.pointRepository.findAll({
                where: { id_owner: id_user },
                attributes: [ 'id', 'name', 'type', 'address', 'description', 'first_photo', 'rating', 'photos', 'coordinates' ],
                order: [["id", "ASC"]]
            })

            const formattedPoints = await Promise.all(points.map(async (p) => {
                const data = p.get({ plain: true })

                const ratingCount = await this.reviewRepository.count({
                    where: {
                        type_object: 'point', 
                        id_object: data.id
                    }
                });

                return {
                id: data.id,
                pointName: data.name,
                pointType: data.type,
                pointLocation: data.address,
                pointDescription: data.description,
                pointCoordinates: data.coordinates.coordinates,
                image: data.first_photo,
                pointRating: Number(data.rating),
                ratingCount: ratingCount,
                imageCarousel: data.photos
            };
            }))

            const routes = await this.routeRepository.findAll({
                where: { id_owner: id_user },
                attributes: [ 'id', 'name', 'description', 'createdAt', 'first_photo' ],
                include: [{
                    model: User,
                    attributes: [ 'username', 'photo' ]
                }, {
                    model: RoutePoint,
                    attributes: [ "id_point", "id_route" ],
                    include: [{
                        model: Point,
                        attributes: [ 'id', 'name', 'type', 'description', 'address', 'rating', 'first_photo', 'photos', 'coordinates' ],
                        order: [["id", "ASC"]]
                    }]
                }]
            })

            const likedRoutes = await this.likedRepository.findAll({
                where: { id_owner }
            });

            const likedRouteIds = new Set(likedRoutes.map(l => l.dataValues.id_object));

            const formattedRoutes = await Promise.all(routes.map(async (r) => {
                const data = r.get({ plain: true })

                const server = "http://217.60.36.77:4000"

                data.first_photo = server + data.first_photo

                const tagsRoutes = await this.routeTagsRepository.findAll({
                    where: { id_route: r.id },
                    attributes: [ 'id_tag' ]
                })

                const tagsRoutesIds = tagsRoutes.map(t => t.id_tag)

                const tags = await this.tagRepository.findAll({
                    where: { id: { [Op.in]: tagsRoutesIds } },
                    attributes: ["id"]
                })

                const likeCount = await this.likedRepository.count({
                    where: { type_object: 'route', id: data.id }
                })

                const commentCount = await this.reviewRepository.count({
                    where: { type_object: 'route', id: data.id }
                })

                const formattedPoints = await Promise.all(data.routes_points.map(async (routePoint: any) => {
                
                    const ratingCount = await this.reviewRepository.count({
                        where: {
                            type_object: 'point', 
                            id_object: routePoint.points.id
                        }
                    });

                    return {
                        id: routePoint.points.id,
                        pointName: routePoint.points.name,
                        pointType: routePoint.points.type,
                        pointDescription: routePoint.points.description,
                        pointLocation: routePoint.points.address,
                        pointCoordinates: routePoint.points.coordinates.coordinates,
                        pointRating: Number(routePoint.points.rating), 
                        ratingCount: ratingCount,
                        image: routePoint.points.first_photo,
                        imageCarousel: routePoint.points.photos
                    };
                }));


                return {
                    id: data.id,
                    routeName: data.name,
                    routeDescription: data.description,
                    routeTags: tags,
                    creationDate: data.createdAt,
                    image: data.first_photo,
                    author: data.owner.username,
                    authorPfp: data.owner.photo,
                    likeCount: likeCount,
                    commentCount: commentCount,
                    isLiked: likedRouteIds.has(data.id),
                    points: formattedPoints,
                }
            }))

            let isOwner = false;

            if (id_user == id_owner) {
                isOwner = true;
            }

            const personalLikes = await this.likedRepository.count({
                where: { id_owner: id_user }
            })

            const personalComments = await this.reviewRepository.count({
                where: { id_owner: id_user }
            })

            return {
                username: user.dataValues.username,
                image: user.dataValues.photo,
                createdPoints: formattedPoints,
                createdRoutes: formattedRoutes,
                myProfile: isOwner,
                personalLikes,
                personalComments
            }

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

}
