import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

    constructor(private searchService: SearchService) {}

    @Get('/test')
    search(@Query('query') query: string) {
        const result = this.searchService.search(query);
        return result;
    }

    @Get('/filterby/:filter')
    searchByFilter(@Param('filter') filter: string) {
        const result = this.searchService.filter(filter);
        return result;
    }

}
