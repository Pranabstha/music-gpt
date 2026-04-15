import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './serach.module';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search users and audio' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  search(
    @Query('q') q: string,
    @Query('limit') limit = '10',
    @Query('cursor') cursor?: string,
  ) {
    return this.searchService.search(q, parseInt(limit), cursor);
  }
}
