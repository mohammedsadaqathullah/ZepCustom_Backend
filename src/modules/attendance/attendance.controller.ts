import { Controller, Get, Post, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
    constructor(private attendanceService: AttendanceService) { }

    @Post('check-in')
    @ApiOperation({ summary: 'Check in to a space' })
    async checkIn(
        @CurrentUser() user: AuthenticatedUser,
        @Query('spaceId') spaceId: string,
    ) {
        return this.attendanceService.checkIn(user.id, spaceId);
    }

    @Post('check-out')
    @ApiOperation({ summary: 'Check out from a space' })
    async checkOut(
        @CurrentUser() user: AuthenticatedUser,
        @Query('spaceId') spaceId: string,
    ) {
        return this.attendanceService.checkOut(user.id, spaceId);
    }

    @Get('my-attendance')
    @ApiOperation({ summary: 'Get my attendance records' })
    async getMyAttendance(
        @CurrentUser() user: AuthenticatedUser,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getUserAttendance(user.id, start, end);
    }

    @Get('my-stats')
    @ApiOperation({ summary: 'Get my attendance statistics for a month' })
    async getMyStats(
        @CurrentUser() user: AuthenticatedUser,
        @Query('month') month: string, // Format: YYYY-MM
    ) {
        return this.attendanceService.getAttendanceStats(user.id, month);
    }

    @Get('space/:spaceId')
    @ApiOperation({ summary: 'Get attendance for a space' })
    async getSpaceAttendance(
        @Param('spaceId') spaceId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getSpaceAttendance(spaceId, start, end);
    }
}
