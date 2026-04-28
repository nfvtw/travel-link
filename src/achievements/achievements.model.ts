
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/user.model";

interface AchievementsCreationAttrs {
    id_owner: number
}


@Table({tableName: 'achievement'})
export class Achievements extends Model<Achievements, AchievementsCreationAttrs> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: true})
    id_owner: number;

    @BelongsTo(() => User) // Связь один-ко-многим
    owner: User;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    added_places: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    created_routes: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    created_route_more_than_5_points: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    created_routes_in_same_city: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    created_route_more_than_5_km: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    created_route_where_points_with_same_tags: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    posted_likes: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    received_likes: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    comments_for_routes: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    comments_for_points: number;



    // Связи
}