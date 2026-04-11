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
import { UsersService } from './user.service';
import { UserDto } from './dto/user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (paginated + cached)' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (cached)' })
  @ApiResponse({ status: 200, description: 'Single user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user (invalidates cache)' })
  @ApiResponse({ status: 200, description: 'Updated user' })
  @ApiResponse({ status: 403, description: 'Cannot update another user' })
  update(@Param('id') id: string, @Body() dto: UserDto, @Request() req) {
    return this.usersService.update(id, req.user.id, dto);
  }
}
