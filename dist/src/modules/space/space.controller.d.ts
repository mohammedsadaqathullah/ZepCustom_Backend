import { SpaceService } from './space.service';
import { CreateSpaceDto, UpdateSpaceDto, UpdateMapDto } from './dto/space.dto';
import type { AuthenticatedUser } from '../auth/types/auth.types';
import { SpaceVisibility } from '@prisma/client';
export declare class SpaceController {
    private spaceService;
    constructor(spaceService: SpaceService);
    getSpaces(visibility?: SpaceVisibility, user?: AuthenticatedUser): Promise<({
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
    createSpace(user: AuthenticatedUser, createDto: CreateSpaceDto): Promise<{
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
    getSpace(id: string): Promise<{
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
    updateSpace(id: string, user: AuthenticatedUser, updateDto: UpdateSpaceDto): Promise<{
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
    deleteSpace(id: string, user: AuthenticatedUser): Promise<{
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
    joinSpace(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    leaveSpace(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    getMap(id: string): Promise<string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray>;
    updateMap(id: string, user: AuthenticatedUser, updateMapDto: UpdateMapDto): Promise<{
        id: string;
        mapJson: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
