
import { Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Achievements } from "src/achievements/achievements.model";
import { Favourite } from "src/favourite/favourite.model";
import { Liked } from "src/liked/liked.model";
import { Point } from "src/point/point.model";
import { Review } from "src/review/review.model";
import { Route } from "src/route/route.model";

interface UserCreationAttrs {
    email: string;
    username: string;
    password: string;
}


@Table({tableName: 'user'})
export class User extends Model<User, UserCreationAttrs> {
    
    // Поле id добавляется автоматически

    @Column({type: DataType.STRING, allowNull: false})
    username: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.STRING, allowNull: false, defaultValue: 'user'})
    role: 'user' | 'moder' | 'admin';

    @Column({type: DataType.STRING, allowNull: true})
    photo: string;

    @Column({type: DataType.INTEGER, defaultValue: 0})
    level: number;

    // Связи

    @HasMany(() => Point, { foreignKey: 'id_owner' }) // Связь один-ко-многим
    points: Point[];

    @HasMany(() => Route, { foreignKey: 'id_owner' }) // Связь один-ко-многим
    routes: Route[];

    @HasMany(() => Review, { foreignKey: 'id_owner' }) // Связь один-ко-многим
    reviews: Review[];

    @HasMany(() => Favourite) // Связь один-ко-многим
    favourites: Favourite[];

    @HasMany(() => Liked) // Связь один-ко-многим
    liked: Liked[];

    @HasOne(() => Achievements, { foreignKey: 'id_owner' })
    achievements: Achievements;
}