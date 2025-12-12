import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';


@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    async getMe(@CurrentUser() user: AuthenticatedUser) {
        return this.userService.getProfile(user.id);
    }

    @Put('me')
    @ApiOperation({ summary: 'Update current user profile' })
    async updateMe(
        @CurrentUser() user: AuthenticatedUser,
        @Body() updateDto: UpdateProfileDto,
    ) {
        return this.userService.updateProfile(user.id, updateDto);
    }
}
