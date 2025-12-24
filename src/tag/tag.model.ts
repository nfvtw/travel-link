
import { Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { TagPoint } from "src/tag-point/tag-point.model";
import { TagRoute } from "src/tag-route/tag-route.model";

interface TagCreationAttrs {
    name: string;
}


@Table({tableName: 'tag'})
export class Tag extends Model<Tag, TagCreationAttrs> {
    
    // Поле id добавляется автоматически

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    // Связи
    
    @HasMany(() => TagPoint, { foreignKey: 'id_tag' })
    tags_points: TagPoint[];

    @HasMany(() => TagRoute, { foreignKey: 'id_tag' })
    tags_routes: TagRoute[];
}