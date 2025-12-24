
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RoutePoint } from "src/route-point/route-point.model";
import { TagRoute } from "src/tag-route/tag-route.model";
import { User } from "src/user/user.model";

interface RouteCreationAttrs {
    name: string;
    description: string;
}


@Table({tableName: 'route'})
export class Route extends Model<Route, RouteCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_owner: string;

    @BelongsTo(() => User)  // Связь один-ко-многим
    owner: User;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    is_public: boolean;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    count_likes: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    count_dislikes: number;

    @Column({type: DataType.TIME, allowNull: false, defaultValue: '00:00:00'})
    time: string;

    @Column({type: DataType.DECIMAL, allowNull: false, defaultValue: 0})
    length: number;

    // Связи

    @HasMany(() => RoutePoint, { foreignKey: 'id_point' })
    routes_points: RoutePoint[];

    @HasMany(() => TagRoute, { foreignKey: 'id_route' })
    tags_routes: TagRoute[];
}