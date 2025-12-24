import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Route } from "src/route/route.model";
import { Tag } from "src/tag/tag.model";

interface TagRouteCreationsAttr {
    id_tag: number;
    id_route: string;
}

@Table({tableName: 'tag-route'})
export class TagRoute extends Model<TagRoute, TagRouteCreationsAttr> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => Tag)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_tag: number;

    @BelongsTo(() => Tag)
    tags: Tag;

    @ForeignKey(() => Route)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_route: number;

    @BelongsTo(() => Route)
    routes: Route;
}