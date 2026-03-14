import { Body, Controller, Post } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {

    constructor(private tagService: TagService) {}

    @Post('/create')
    create(@Body() names: { name: string[] }) {
        const tag = this.tagService.create(names);
        return tag;
    }

}
