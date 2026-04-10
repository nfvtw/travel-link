
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Point } from "src/point/point.model";
import { Route } from "src/route/route.model";
import { User } from "src/user/user.model";

interface ReviewCreationAttrs {
    id_owner: number;
    type_object: string;
    id_object: number;
    comment: string;
}


@Table({tableName: 'review'})
export class Review extends Model<Review, ReviewCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_owner: number;

    @BelongsTo(() => User)  // Связь один-ко-многим
    owner: User;

    @Column({type: DataType.STRING, allowNull: false})
    type_object: 'point' | 'route';

    // @ForeignKey(() => Route | Point)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_object: number;

    @Column({type: DataType.DECIMAL(3,1)})
    rating: number;

    @Column({type: DataType.STRING})
    comment: string;
}