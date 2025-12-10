
import { Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/user/user.model";

interface PoinCreationAttrs {
    name: string;
    description: string;
    coordinates: number;
}


@Table({tableName: 'point'})
export class Point extends Model<Point, PoinCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_owner: string;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    is_free: string;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    is_custom: string;

    // @Column({type: DataType.FLOAT})
    // @HasMany(() => Review)
    // reviews: Review[];

    @Column({type: DataType.FLOAT, allowNull: false})
    coordinates: number;

    @Column(DataType.JSON)
    photos: string[];

}