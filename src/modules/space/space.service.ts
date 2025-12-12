import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSpaceDto, UpdateSpaceDto, UpdateMapDto } from './dto/space.dto';
import { SpaceRole, SpaceVisibility } from '@prisma/client';

@Injectable()
export class SpaceService {
    constructor(private prisma: PrismaService) { }

    async createSpace(userId: string, createDto: CreateSpaceDto) {
        // Check if slug already exists
        const existing = await this.prisma.space.findUnique({
            where: { slug: createDto.slug },
        });

        if (existing) {
            throw new ConflictException('Space slug already taken');
        }

        const space = await this.prisma.space.create({
            data: {
                ...createDto,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: SpaceRole.OWNER,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: { members: true },
                },
            },
        });

        return space;
    }

    async getSpaces(userId?: string, visibility?: SpaceVisibility) {
        const where: any = {};

        if (visibility) {
            where.visibility = visibility;
        } else if (userId) {
            // Show public spaces OR spaces where user is a member
            where.OR = [
                { visibility: SpaceVisibility.PUBLIC },
                {
                    members: {
                        some: {
                            userId: userId
                        }
                    }
                }
            ];
        } else {
            // Not authenticated - only show public
            where.visibility = SpaceVisibility.PUBLIC;
        }

        return this.prisma.space.findMany({
            where,
            include: {
                owner: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: { members: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getSpaceById(spaceId: string, userId?: string) {
        const space = await this.prisma.space.findUnique({
            where: { id: spaceId },
            include: {
                owner: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        if (!space) {
            throw new NotFoundException('Space not found');
        }

        // Check visibility and access
        if (space.visibility === SpaceVisibility.PRIVATE && userId) {
            const member = space.members.find((m: any) => m.userId === userId);
            if (!member && space.ownerId !== userId) {
                throw new ForbiddenException('Access denied');
            }
        }

        return space;
    }

    async updateSpace(spaceId: string, userId: string, updateDto: UpdateSpaceDto) {
        await this.checkSpacePermission(spaceId, userId, [SpaceRole.OWNER, SpaceRole.ADMIN]);

        return this.prisma.space.update({
            where: { id: spaceId },
            data: updateDto,
        });
    }

    async deleteSpace(spaceId: string, userId: string) {
        await this.checkSpacePermission(spaceId, userId, [SpaceRole.OWNER]);

        return this.prisma.space.delete({
            where: { id: spaceId },
        });
    }

    async joinSpace(spaceId: string, userId: string) {
        const space = await this.prisma.space.findUnique({
            where: { id: spaceId },
        });

        if (!space) {
            throw new NotFoundException('Space not found');
        }

        if (space.visibility === SpaceVisibility.PRIVATE || space.visibility === SpaceVisibility.INVITE_ONLY) {
            throw new ForbiddenException('Cannot join this space');
        }

        // Check if already a member
        const existing = await this.prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId,
                },
            },
        });

        if (existing) {
            return { message: 'Already a member' };
        }

        await this.prisma.spaceMember.create({
            data: {
                userId,
                spaceId,
                role: SpaceRole.MEMBER,
            },
        });

        return { message: 'Joined space successfully' };
    }

    async leaveSpace(spaceId: string, userId: string) {
        const member = await this.prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId,
                },
            },
        });

        if (!member) {
            throw new NotFoundException('Not a member of this space');
        }

        if (member.role === SpaceRole.OWNER) {
            throw new ForbiddenException('Owner cannot leave the space');
        }

        await this.prisma.spaceMember.delete({
            where: { id: member.id },
        });

        return { message: 'Left space successfully' };
    }

    async getMap(spaceId: string) {
        const space = await this.prisma.space.findUnique({
            where: { id: spaceId },
            select: { mapJson: true },
        });

        if (!space) {
            throw new NotFoundException('Space not found');
        }

        return space.mapJson || {};
    }

    async updateMap(spaceId: string, userId: string, updateMapDto: UpdateMapDto) {
        await this.checkSpacePermission(spaceId, userId, [SpaceRole.OWNER, SpaceRole.ADMIN]);

        return this.prisma.space.update({
            where: { id: spaceId },
            data: { mapJson: updateMapDto.mapJson },
            select: { id: true, mapJson: true },
        });
    }

    private async checkSpacePermission(spaceId: string, userId: string, allowedRoles: SpaceRole[]) {
        const member = await this.prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId,
                },
            },
        });

        if (!member || !allowedRoles.includes(member.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }
    }
}
