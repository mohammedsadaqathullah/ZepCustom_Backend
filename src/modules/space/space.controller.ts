import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SpaceService } from './space.service';
import { CreateSpaceDto, UpdateSpaceDto, UpdateMapDto } from './dto/space.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';
import { SpaceVisibility } from '@prisma/client';


@ApiTags('spaces')
@Controller('spaces')
export class SpaceController {
    constructor(private spaceService: SpaceService) { }

    @Get()
    @ApiOperation({ summary: 'Get list of spaces' })
    async getSpaces(
        @Query('visibility') visibility?: SpaceVisibility,
        @CurrentUser() user?: AuthenticatedUser,
    ) {
        return this.spaceService.getSpaces(user?.id, visibility);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new space' })
    async createSpace(
        @CurrentUser() user: AuthenticatedUser,
        @Body() createDto: CreateSpaceDto,
    ) {
        return this.spaceService.createSpace(user.id, createDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get space by ID' })
    async getSpace(@Param('id') id: string) {
        return this.spaceService.getSpaceById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update space' })
    async updateSpace(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
        @Body() updateDto: UpdateSpaceDto,
    ) {
        return this.spaceService.updateSpace(id, user.id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete space' })
    async deleteSpace(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.spaceService.deleteSpace(id, user.id);
    }

    @Post(':id/join')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Join a space' })
    async joinSpace(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.spaceService.joinSpace(id, user.id);
    }

    @Post(':id/leave')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Leave a space' })
    async leaveSpace(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.spaceService.leaveSpace(id, user.id);
    }

    @Get(':id/map')
    @ApiOperation({ summary: 'Get space map' })
    async getMap(@Param('id') id: string) {
        return this.spaceService.getMap(id);
    }

    @Post(':id/map')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update space map' })
    async updateMap(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
        @Body() updateMapDto: UpdateMapDto,
    ) {
        return this.spaceService.updateMap(id, user.id, updateMapDto);
    }
}
