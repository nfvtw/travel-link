
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Point } from "src/point/point.model";
import { Route } from "src/route/route.model";
import { User } from "src/user/user.model";

interface FavouriteCreationAttrs {
    name: string;
    description: string;
}


@Table({tableName: 'favourite'})
export class Favourite extends Model<Favourite, FavouriteCreationAttrs> {
    
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