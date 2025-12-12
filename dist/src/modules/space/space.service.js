"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SpaceService = class SpaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSpace(userId, createDto) {
        const existing = await this.prisma.space.findUnique({
            where: { slug: createDto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('Space slug already taken');
        }
        const space = await this.prisma.space.create({
            data: {
                ...createDto,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: client_1.SpaceRole.OWNER,
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
    async getSpaces(userId, visibility) {
        const where = {};
        if (visibility) {
            where.visibility = visibility;
        }
        else if (userId) {
            where.OR = [
                { visibility: client_1.SpaceVisibility.PUBLIC },
                {
                    members: {
                        some: {
                            userId: userId
                        }
                    }
                }
            ];
        }
        else {
            where.visibility = client_1.SpaceVisibility.PUBLIC;
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
    async getSpaceById(spaceId, userId) {
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
            throw new common_1.NotFoundException('Space not found');
        }
        if (space.visibility === client_1.SpaceVisibility.PRIVATE && userId) {
            const member = space.members.find((m) => m.userId === userId);
            if (!member && space.ownerId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        return space;
    }
    async updateSpace(spaceId, userId, updateDto) {
        await this.checkSpacePermission(spaceId, userId, [client_1.SpaceRole.OWNER, client_1.SpaceRole.ADMIN]);
        return this.prisma.space.update({
            where: { id: spaceId },
            data: updateDto,
        });
    }
    async deleteSpace(spaceId, userId) {
        await this.checkSpacePermission(spaceId, userId, [client_1.SpaceRole.OWNER]);
        return this.prisma.space.delete({
            where: { id: spaceId },
        });
    }
    async joinSpace(spaceId, userId) {
        const space = await this.prisma.space.findUnique({
            where: { id: spaceId },
        });
        if (!space) {
            throw new common_1.NotFoundException('Space not found');
        }
        if (space.visibility === client_1.SpaceVisibility.PRIVATE || space.visibility === client_1.SpaceVisibility.INVITE_ONLY) {
            throw new common_1.ForbiddenException('Cannot join this space');
        }
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
                role: client_1.SpaceRole.MEMBER,
            },
        });
        return { message: 'Joined space successfully' };
    }
    async leaveSpace(spaceId, userId) {
        const member = await this.prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId,
                },
            },
        });
        if (!member) {
            throw new common_1.NotFoundException('Not a member of this space');
        }
        if (member.role === client_1.SpaceRole.OWNER) {
            throw new common_1.ForbiddenException('Owner cannot leave the space');
        }
        await this.prisma.spaceMember.delete({
            where: { id: member.id },
        });
        return { message: 'Left space successfully' };
    }
    async getMap(spaceId) {
        const space = await this.prisma.space.findUnique({
            where: { id: spaceId },
            select: { mapJson: true },
        });
        if (!space) {
            throw new common_1.NotFoundException('Space not found');
        }
        return space.mapJson || {};
    }
    async updateMap(spaceId, userId, updateMapDto) {
        await this.checkSpacePermission(spaceId, userId, [client_1.SpaceRole.OWNER, client_1.SpaceRole.ADMIN]);
        return this.prisma.space.update({
            where: { id: spaceId },
            data: { mapJson: updateMapDto.mapJson },
            select: { id: true, mapJson: true },
        });
    }
    async checkSpacePermission(spaceId, userId, allowedRoles) {
        const member = await this.prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId,
                },
            },
        });
        if (!member || !allowedRoles.includes(member.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
    }
};
exports.SpaceService = SpaceService;
exports.SpaceService = SpaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpaceService);
//# sourceMappingURL=space.service.js.map