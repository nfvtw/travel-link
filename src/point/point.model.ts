
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RoutePoint } from "src/route-point/route-point.model";
import { TagPoint } from "src/tag-point/tag-point.model";
import { User } from "src/user/user.model";

interface PointCreationAttrs {
    id_owner: number;
    name: string;
    coordinates: { type: string; coordinates: [number, number] };
}


@Table({tableName: 'point'})
export class Point extends Model<Point, PointCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_owner: number;

    @BelongsTo(() => User) // Связь один-ко-многим
    owner: User;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING})
    description: string;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    is_free: boolean;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    is_custom: boolean;

    @Column({ type: DataType.DECIMAL(3,1), defaultValue: 0 })
    rating: number;

    @Column({type: DataType.GEOMETRY('POINT'), allowNull: false})
    coordinates: { type: string; coordinates: [number, number] }; 

    @Column(DataType.JSON)
    photos: string[];

    // Связи

    @HasMany(() => RoutePoint, { foreignKey: 'id_point' })
    routes_points: RoutePoint[];

    @HasMany(() => TagPoint, { foreignKey: 'id_point' })
    tags_points: TagPoint[];
}