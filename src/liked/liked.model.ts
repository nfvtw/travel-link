
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Point } from "src/point/point.model";
import { Route } from "src/route/route.model";
import { User } from "src/user/user.model";

interface LikedCreationAttrs {
    name: string;
    description: string;
}


@Table({tableName: 'liked'})
export class Liked extends Model<Liked, LikedCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_owner: number;

    @BelongsTo(() => User)
    owner: User;

    @Column({type: DataType.STRING, allowNull: false})
    type_object: 'point' | 'route';

    // @ForeignKey(() => Route | Point)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_object: number;
}