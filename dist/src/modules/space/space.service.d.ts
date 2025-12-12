import { PrismaService } from '../../prisma/prisma.service';
import { CreateSpaceDto, UpdateSpaceDto, UpdateMapDto } from './dto/space.dto';
import { SpaceVisibility } from '@prisma/client';
export declare class SpaceService {
    private prisma;
    constructor(prisma: PrismaService);
    createSpace(userId: string, createDto: CreateSpaceDto): Promise<{
        _count: {
            members: number;
        };
        owner: {
            id: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        visibility: import(".prisma/client").$Enums.SpaceVisibility;
        maxCapacity: number;
        ownerId: string;
        mapJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getSpaces(userId?: string, visibility?: SpaceVisibility): Promise<({
        _count: {
            members: number;
        };
        owner: {
            id: string;
            displayName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        visibility: import(".prisma/client").$Enums.SpaceVisibility;
        maxCapacity: number;
        ownerId: string;
        mapJson: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getSpaceById(spaceId: string, userId?: string): Promise<{
        owner: {
            id: string;
            displayName: string;
            avatarUrl: string | null;
        };
        members: ({
            user: {
                id: string;
                displayName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.SpaceRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            spaceId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        visibility: import(".prisma/client").$Enums.SpaceVisibility;
        maxCapacity: number;
        ownerId: string;
        mapJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateSpace(spaceId: string, userId: string, updateDto: UpdateSpaceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        visibility: import(".prisma/client").$Enums.SpaceVisibility;
        maxCapacity: number;
        ownerId: string;
        mapJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    deleteSpace(spaceId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        visibility: import(".prisma/client").$Enums.SpaceVisibility;
        maxCapacity: number;
        ownerId: string;
        mapJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    joinSpace(spaceId: string, userId: string): Promise<{
        message: string;
    }>;
    leaveSpace(spaceId: string, userId: string): Promise<{
        message: string;
    }>;
    getMap(spaceId: string): Promise<string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray>;
    updateMap(spaceId: string, userId: string, updateMapDto: UpdateMapDto): Promise<{
        id: string;
        mapJson: import("@prisma/client/runtime/library").JsonValue;
    }>;
    private checkSpacePermission;
}
