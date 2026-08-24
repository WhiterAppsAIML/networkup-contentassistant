import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async profile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get usage statistics' })
  async usage(@CurrentUser('id') userId: string) {
    return this.userService.getUsageStats(userId);
  }

  @Patch('upgrade')
  @ApiOperation({ summary: 'Upgrade user tier' })
  async upgrade(@CurrentUser('id') userId: string, @Body('tier') tier: 'PRO' | 'ENTERPRISE') {
    return this.userService.upgradeTier(userId, tier);
  }
}