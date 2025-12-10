
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserCreationAttrs {
    email: string;
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
    role: string;

    @Column({type: DataType.STRING, allowNull: true})
    photo: string;
}