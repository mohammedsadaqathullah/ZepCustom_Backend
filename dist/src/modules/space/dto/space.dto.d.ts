import { SpaceVisibility } from '@prisma/client';
export declare class CreateSpaceDto {
    name: string;
    slug: string;
    description?: string;
    visibility?: SpaceVisibility;
    maxCapacity?: number;
}
export declare class UpdateSpaceDto {
    name?: string;
    description?: string;
    visibility?: SpaceVisibility;
    maxCapacity?: number;
}
export declare class UpdateMapDto {
    mapJson: any;
}
