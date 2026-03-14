import { Body, Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

    constructor(private searchService: SearchService) {}

    @Get('/test')
    search(@Query('query') query: string) {
        const result = this.searchService.search(query);
        return result;
    }

}
