import { Model } from "sequelize-typescript";
import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { Point } from "src/point/point.model";
import { Route } from "src/route/route.model";

interface RoutePointCreationAttrs {
    id_point: number;
    id_route: number;
}

@Table({tableName: 'route-point'})
export class RoutePoint extends Model<RoutePoint, RoutePointCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => Point)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_point: number;

    @BelongsTo(() => Point)
    points: Point;

    @ForeignKey(() => Route)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_route: number;

    @BelongsTo(() => Route)
    routes: Route;
    coordinates: any;
}
