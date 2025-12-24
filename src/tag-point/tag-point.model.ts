import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Point } from "src/point/point.model";
import { Tag } from "src/tag/tag.model";

interface TagPointCreationsAttr {
    id_tag: number;
    id_point: string;
}

@Table({tableName: 'tag-point'})
export class TagPoint extends Model<TagPoint, TagPointCreationsAttr> {
    
    // Поле id добавляется автоматически

    @ForeignKey(() => Tag)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_tag: number;

    @BelongsTo(() => Tag)
    tags: Tag;

    @ForeignKey(() => Point)
    @Column({type: DataType.INTEGER, allowNull: false})
    id_point: number;

    @BelongsTo(() => Point)
    points: Point;
}