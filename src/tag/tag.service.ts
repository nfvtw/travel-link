import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './tag.model';

@Injectable()
export class TagService {

    constructor(@InjectModel(Tag) private tagRepository: typeof Tag) {}

    async create(names: { name: string[] }) {
        console.log("ВХОД", names)
        const namesData = names.name.map(onename => ({
            name: onename
        }))
        console.log("ВЫХОД", namesData);
        return await this.tagRepository.bulkCreate(namesData)
    }

}
