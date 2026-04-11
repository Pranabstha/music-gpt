import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AudioService } from './audio.service';
import { AudioDto } from './audio.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Audio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audio (paginated + cached)' })
  findAll(@Query() pagination: PaginationDto) {
    return this.audioService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audio by ID (cached)' })
  @ApiResponse({ status: 404, description: 'Audio not found' })
  findOne(@Param('id') id: string) {
    return this.audioService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update audio title (invalidates cache)' })
  @ApiResponse({
    status: 403,
    description: 'Cannot update audio you do not own',
  })
  update(@Param('id') id: string, @Body() dto: AudioDto, @Request() req) {
    return this.audioService.update(id, req.user.id, dto);
  }
}
