
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RoutePoint } from "src/route-point/route-point.model";
import { TagRoute } from "src/tag-route/tag-route.model";
import { User } from "src/user/user.model";

interface RouteCreationAttrs {
    id_owner: number;
    name: string;
    description: string;
    first_photo: string;
}


@Table({tableName: 'route'})
export class Route extends Model<Route, RouteCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_owner: number;

    @BelongsTo(() => User)  // Связь один-ко-многим
    owner: User;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING(2000), allowNull: false})
    description: string;

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: true})
    is_public: boolean;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    count_likes: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    count_dislikes: number;

    @Column({type: DataType.TIME, allowNull: false, defaultValue: '00:00:00'})
    time: string;

    @Column({type: DataType.DECIMAL, allowNull: false, defaultValue: 0})
    length: number;

    @Column({type: DataType.STRING, allowNull: false})
    first_photo: string;

    // Связи

    @HasMany(() => RoutePoint, { foreignKey: 'id_route' })
    routes_points: RoutePoint[];

    @HasMany(() => TagRoute, { foreignKey: 'id_route' })
    tags_routes: TagRoute[];
}