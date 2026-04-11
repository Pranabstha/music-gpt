import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Upgrade to PAID tier' })
  subscribe(@Request() req) {
    return this.subscriptionService.subscribe(req.user.id);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Downgrade to FREE tier' })
  cancel(@Request() req) {
    return this.subscriptionService.cancel(req.user.id);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current subscription status' })
  status(@Request() req) {
    return this.subscriptionService.getStatus(req.user.id);
  }
}
